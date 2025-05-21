import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import CreateBookDto from './dto/create-book.dto';
import { Book, BookFormat } from 'src/entities/book.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { FILE_CONSTANTS } from 'src/common/utils/constants';
import { removeFile, replaceFile, saveFile } from 'src/common/utils/functions';
import SearchBookDto from './dto/search-book.dto';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { ReadingProgress } from 'src/entities/reading-progress.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(ReadingProgress)
    private readonly readingProgressRepository: Repository<ReadingProgress>,
  ) {}

  async create(
    bookData: CreateBookDto,
    ebookFile: Express.Multer.File[] | null,
    coverImageFile: Express.Multer.File[] | null,
    ebookFilename?: string,
    coverImageFilename?: string,
  ): Promise<{ id: number }> {
    if (bookData.format === BookFormat.DIG) {
      if (ebookFile) bookData.stock = 1;
      else bookData.stock = 0;
    }

    const result = await this.bookRepository.insert({
      ...bookData,
      coverImageFilename,
      ebookFilename,
    });

    if (result.identifiers.length === 0)
      throw new InternalServerErrorException('Thêm sách mới thất bại!');

    if (ebookFile && ebookFilename)
      saveFile(ebookFile[0], FILE_CONSTANTS.EBOOK_FOLDER, ebookFilename);

    if (coverImageFile && coverImageFilename)
      saveFile(coverImageFile[0], FILE_CONSTANTS.COVER_IMAGES_FOLDER, coverImageFilename);

    return { id: result.identifiers[0].id };
  }

  async update(
    id: number,
    bookData: UpdateBookDto,
    ebookFile: Express.Multer.File[] | null,
    coverImageFile: Express.Multer.File[] | null,
  ): Promise<{ id: number }> {
    //Find old book's data
    const book = await this.findById(id);

    if (book.format === BookFormat.PHYS && ebookFile)
      throw new BadRequestException('Ebook không được có trong sách bản in!');

    const newFilenames: {
      ebookFilename: string | undefined;
      coverImageFilename: string | undefined;
    } = {
      ebookFilename: undefined,
      coverImageFilename: undefined,
    };

    if (ebookFile && ebookFile.length > 0) {
      newFilenames.ebookFilename = replaceFile(
        ebookFile[0],
        FILE_CONSTANTS.EBOOK_FOLDER,
        book.ebookFilename,
      );
    }

    if (coverImageFile && coverImageFile.length > 0) {
      newFilenames.coverImageFilename = replaceFile(
        coverImageFile[0],
        FILE_CONSTANTS.COVER_IMAGES_FOLDER,
        book.coverImageFilename,
      );
    }

    const result = await this.bookRepository.update({ id }, { ...bookData, ...newFilenames });

    if (!result.affected || result.affected === 0)
      throw new InternalServerErrorException('Cập nhật sách thất bại!');

    return { id };
  }

  async findById(id: number) {
    const result = await this.bookRepository.findOneBy({ id });

    if (!result) throw new NotFoundException(`Không tìm thấy sách id: ${id}!`);

    return result;
  }

  async delete(id: number): Promise<{
    book: Book;
    isRemovedCoverImageFile: boolean | undefined;
    isRemovedEbookFile: boolean | undefined;
  }> {
    const book = await this.findById(id);

    const result = await this.bookRepository.delete({ id: book.id });

    if (!result?.affected || result?.affected === 0)
      throw new InternalServerErrorException('Xóa không thành công!');

    let isRemovedEbookFile: boolean = false;
    if (book.ebookFilename && book.ebookFilename !== '') {
      isRemovedEbookFile = await removeFile(book.ebookFilename, FILE_CONSTANTS.EBOOK_FOLDER);
    }

    let isRemovedCoverImageFile: boolean = false;
    if (book.coverImageFilename && book.coverImageFilename !== '') {
      isRemovedCoverImageFile = await removeFile(
        book.coverImageFilename,
        FILE_CONSTANTS.COVER_IMAGES_FOLDER,
      );
    }

    return {
      book,
      isRemovedEbookFile,
      isRemovedCoverImageFile,
    };
  }

  async filterBooks({
    author,
    format,
    genre,
    publishedDate,
    stock,
    title,
    version,
    currentPage,
    limit,
    sortBy,
    sortOrder,
  }: SearchBookDto): Promise<Book[]> {
    let where: any = {};
    if (author) where.author = Like(`%${author}%`);
    if (title) where.title = Like(`%${author}%`);
    if (format) where.format = format;
    if (genre) where.genre = genre;
    if (publishedDate) where.publishedDate = publishedDate;
    if (stock) where.stock = stock;
    if (version) where.version = version;

    const users = await this.bookRepository.find({
      where,
      order: { [sortBy]: sortOrder },
      take: limit,
      skip: currentPage && limit ? (currentPage - 1) * limit : undefined,
    });

    return users;
  }

  async existBookId(bookId: number): Promise<boolean> {
    return this.bookRepository.existsBy({ id: bookId });
  }

  async searchBooksByTitleOrAuthor(searchString: string): Promise<Book[]> {
    const lowerQuery = searchString.toLowerCase(); // Chuyển input thành chữ thường
    const searchTerm = `%${lowerQuery}%`; // Thêm ký tự wildcard cho LIKE

    try {
      const books = await this.bookRepository
        .createQueryBuilder('book')
        .addSelect(
          `(
          LEAST(
            LEVENSHTEIN(LOWER(book.title), :query),  -- Khoảng cách với title
            LEVENSHTEIN(LOWER(book.author), :query)  -- Khoảng cách với author
          ) + 
          IFNULL(NULLIF(LOCATE(:query, LOWER(book.title)), 0), 9999) * 0.1 +  -- Vị trí trong title
          IFNULL(NULLIF(LOCATE(:query, LOWER(book.author)), 0), 9999) * 0.1   -- Vị trí trong author
        )`,
          'similarity_score', // Đặt tên cho điểm số
        )
        .setParameters({ searchTerm, query: lowerQuery }) // Truyền tham số
        .where('LOWER(book.title) LIKE :searchTerm') // Tìm trong title
        .orWhere('LOWER(book.author) LIKE :searchTerm') // Tìm trong author
        .orderBy('similarity_score', 'ASC') // Sắp xếp theo điểm số tăng dần
        .addOrderBy('book.title', 'ASC') // Sắp xếp phụ theo title
        .getMany();
      return books;
    } catch (error) {
      console.log({ find_book_by_author_or_title_err: error });

      throw new InternalServerErrorException('Lỗi khi tìm kiếm sách');
    }
  }

  async createReadingProgress(
    userId: number,
    { bookId, lastOffset, lastPage }: CreateReadingProgressDto,
  ) {
    const exist = await this.bookRepository.existsBy({
      id: bookId,
      format: BookFormat.DIG,
      ebookFilename: Not(In(['', ' ', null, undefined])),
    });

    if (!exist) {
      throw new BadRequestException(
        'Sách không tồn tại hoặc không phải sách điện tử hoặc không có file Ebook!',
      );
    }

    const result = this.readingProgressRepository.insert({ bookId, userId, lastOffset, lastPage });
    if (!result) throw new InternalServerErrorException('Tạo tiến độ đọc sách thất bại!');
  }
}
