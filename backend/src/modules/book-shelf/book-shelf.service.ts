import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import { UpdateBookShelfDto } from './dto/update-book-shelf.dto';
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
    const hasBook = await this.bookRepository.existsBy({ id: createBookShelfDto.bookId });
    if (!hasBook) throw new NotFoundException('Không tìm thấy sách');

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

  findOne(id: number) {
    return `This action returns a #${id} bookShelf`;
  }

  update(id: number, updateBookShelfDto: UpdateBookShelfDto) {
    return `This action updates a #${id} bookShelf`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookShelf`;
  }
}
