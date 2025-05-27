import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import { ChangeBookShelfStatusDto } from './dto/change-book-shelf-status.dto';
import { Repository } from 'typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { FilterBookShelfDto } from './dto/filter-bookShelf.dto';

@Injectable()
export class BookShelfService {
  constructor(
    @InjectRepository(Bookshelf) private readonly bookShelfRepository: Repository<Bookshelf>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(userId: number, createBookShelfDto: CreateBookShelfDto) {
    //Check if the book exists
    const hasBook = await this.bookRepository.existsBy({ id: createBookShelfDto.bookId });
    if (!hasBook) throw new NotFoundException('Không tìm thấy sách');

    // Check if the book is already in the user's bookshelf
    const hasBookInShelf = await this.bookShelfRepository.existsBy({
      userId,
      bookId: createBookShelfDto.bookId,
    });
    if (hasBookInShelf) throw new ConflictException('Sách đã có trong tủ sách của bạn!');

    // Insert the new book into the bookshelf
    const result = await this.bookShelfRepository.insert({ ...createBookShelfDto, userId });

    if (result.identifiers.length < 1)
      throw new InternalServerErrorException('Thêm vào tủ sách thất bại!');

    return { id: result.identifiers[0].id };
  }

  async filter(userId: number, { bookId, ...filterData }: FilterBookShelfDto) {
    const query = this.bookShelfRepository.createQueryBuilder('bookShelf');
    query.where('bookShelf.userId = :userId', { userId });

    if (bookId) query.andWhere('bookShelf.bookId = :bookId', { bookId });

    if (filterData.status)
      query.andWhere('bookShelf.status = :status', { status: filterData.status });

    if (filterData.sortBy)
      query.orderBy(
        `bookShelf.${filterData.sortBy}`,
        filterData.sortOrder === 'asc' ? 'ASC' : 'DESC',
      );

    return await query.getMany();
  }

  async findOne(id: number) {
    // Check if the bookshelf entry exists
    const bookShelf = await this.bookShelfRepository.findOneBy({ id });
    if (!bookShelf) throw new NotFoundException('Không tìm thấy sách trong tủ sách của bạn!');

    return bookShelf;
  }

  async changeStatus(id: number, changeStatus: ChangeBookShelfStatusDto) {
    // Check if the bookshelf entry exists
    const bookShelf = await this.bookShelfRepository.existsBy({ id });
    if (!bookShelf) throw new NotFoundException('Không tìm thấy sách trong tủ sách của bạn!');

    // Update the status
    const result = await this.bookShelfRepository.update({ id }, { status: changeStatus.status });

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('Cập nhật trạng thái thất bại!');

    return { id, status: changeStatus.status };
  }

  async remove(userId: number, id: number) {
    // Check if the bookshelf entry exists
    const bookShelf = await this.bookShelfRepository.findOneBy({ id, userId });
    if (!bookShelf) throw new NotFoundException('Không tìm thấy sách trong tủ sách của bạn!');

    // Delete the bookshelf entry
    const result = await this.bookShelfRepository.delete({ id });

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('Xoá sách khỏi tủ sách thất bại!');

    return { id };
  }
}
