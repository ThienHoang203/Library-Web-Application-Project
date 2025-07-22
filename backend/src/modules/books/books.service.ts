import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import CreateBookDto from './dto/create-book.dto';
import { Book, BookFormat } from 'src/entities/book.entity';
import { In, Like, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { FILE_CONSTANTS } from 'src/common/utils/constants';
import { removeFile, replaceFile, saveFile } from 'src/common/utils/functions';
import SearchBookDto from './dto/search-book.dto';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { ReadingProgress } from 'src/entities/reading-progress.entity';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';

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
    const result = await this.bookRepository.findOne({
      where: { id },
      relations: ['ratings', 'ratings.user'],
    });

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
  }: SearchBookDto): Promise<any[]> {
    let where: any = {};
    if (author) where.author = Like(`%${author}%`);
    if (title) where.title = Like(`%${author}%`);
    if (format) where.format = format;
    if (genre) where.genre = genre;
    if (publishedDate) where.publishedDate = publishedDate;
    if (stock) where.stock = stock;
    if (version) where.version = version;

    const query = this.bookRepository.createQueryBuilder('book');

    // Áp điều kiện where nếu có
    if (where) {
      query.where(where);
    }

    // Áp order
    if (sortBy && sortOrder) {
      query.orderBy(`book.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    }

    // Pagination
    if (limit) {
      query.take(limit);
      if (currentPage) {
        query.skip((currentPage - 1) * limit);
      }
    }

    // Join relation ratings
    query
      .leftJoinAndSelect('book.ratings', 'r')
      .addSelect('COUNT(r.id)', 'ratingCount')
      .addSelect('AVG(r.rating)', 'avgRating')
      .groupBy('book.id');

    // const books = await this.bookRepository.find({
    //   where,
    //   order: { [sortBy]: sortOrder },
    //   take: limit,
    //   skip: currentPage && limit ? (currentPage - 1) * limit : undefined,
    //   relations: ['ratings'],
    // });

    const raw = await query.getRawMany();

    return raw.map((book) => {
      return {
        id: book.book_id,
        title: book.book_title,
        format: book.book_format,
        author: book.book_author,
        coverImageFilename: book.book_coverImageFilename,
        ebookFilename: book.book_ebookFilename,
        genre: book.book_genre,
        description: book.book_description,
        stock: book.book_stock,
        waitingBorrowCount: book.book_waitingBorrowCount,
        publishedDate: book.book_publishedDate,
        version: book.book_version,
        ratingCount: book.ratingCount,
        avgRating: book.avgRating,
      };
    });
  }

  async existBookId(bookId: number): Promise<boolean> {
    return this.bookRepository.existsBy({ id: bookId });
  }

  async searchBooksByTitleOrAuthor(searchString: string) {
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
        .leftJoinAndSelect('book.ratings', 'r')
        .addSelect('COUNT(r.id)', 'ratingCount')
        .addSelect('AVG(r.rating)', 'avgRating')
        .groupBy('book.id')
        .getRawMany(); // Tải các đánh giá liên quan

      const booksResult = books.map((book) => {
        return {
          id: book.book_id,
          title: book.book_title,
          format: book.book_format,
          author: book.book_author,
          coverImageFilename: book.book_coverImageFilename,
          ebookFilename: book.book_ebookFilename,
          genre: book.book_genre,
          description: book.book_description,
          stock: book.book_stock,
          waitingBorrowCount: book.book_waitingBorrowCount,
          publishedDate: book.book_publishedDate,
          version: book.book_version,
          ratingCount: book.ratingCount,
          avgRating: book.avgRating,
        };
      });
      return booksResult;
    } catch (error) {
      console.log({ find_book_by_author_or_title_err: error });

      throw new InternalServerErrorException('Lỗi khi tìm kiếm sách');
    }
  }

  async createReadingProgress(
    userId: number,
    { bookId, lastOffset, lastPage }: CreateReadingProgressDto,
  ) {
    // Kiểm tra xem người dùng có tồn tại tiến độ đọc sách cho cuốn sách này không
    let exists: boolean = await this.readingProgressRepository.existsBy({
      bookId,
      userId,
    });
    if (exists) {
      throw new ConflictException('Tiến độ đọc sách đã tồn tại!');
    }

    // Kiểm tra xem sách có tồn tại và là sách điện tử hay không
    exists = await this.bookRepository.existsBy({
      id: bookId,
      format: BookFormat.DIG,
      ebookFilename: Raw((alias) => `${alias} IS NOT NULL AND TRIM(${alias}) <> ''`),
    });
    if (!exists) {
      throw new BadRequestException(
        'Sách không tồn tại hoặc không phải sách điện tử hoặc không có file Ebook!',
      );
    }

    // Tạo tiến độ đọc sách mới
    const result = await this.readingProgressRepository.insert({
      bookId,
      userId,
      lastOffset,
      lastPage,
    });
    // Kiểm tra kết quả trả về
    if (result.identifiers.length < 1)
      throw new InternalServerErrorException('Tạo tiến độ đọc sách thất bại!');
  }

  async updateReadingProgress(
    userId: number,
    { bookId, lastPage, lastOffset }: UpdateReadingProgressDto,
  ) {
    const progress = await this.readingProgressRepository.findOne({
      relations: ['book'],
      where: { bookId, userId },
    });

    if (!progress) {
      throw new BadRequestException('Tiến độ đọc sách không tồn tại');
    }

    const result = await this.readingProgressRepository.update(progress.id, {
      lastPage,
      lastOffset: lastOffset ?? progress.lastOffset,
    });
    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('cập nhật tiến độ đọc sách thất bại!');
  }

  async getReadingProgressByUserIdAndBookId(
    userId: number,
    bookId: number,
  ): Promise<ReadingProgress> {
    const progress = await this.readingProgressRepository.findOne({
      where: { userId, bookId },
      relations: ['book'],
    });

    if (!progress) {
      throw new NotFoundException('Tiến độ đọc sách không tồn tại');
    }

    return progress;
  }
}
