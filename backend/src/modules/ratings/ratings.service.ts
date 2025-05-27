import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/entities/rating.entity';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { ResultSetHeader } from 'mysql2';
import { UserSearchRatingDto } from './dto/user-search-rating.dto';
import { SearchRatingDto } from './dto/search-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
    private bookService: BooksService,
  ) {}

  async create(userId: number, createRatingDto: CreateRatingDto) {
    if (!(await this.bookService.existBookId(createRatingDto.bookId)))
      throw new NotFoundException(`Không tồn tại cuốn sách id: ${createRatingDto.bookId}!`);

    if (await this.ratingRepository.existsBy({ userId, bookId: createRatingDto.bookId }))
      throw new ConflictException('Đã có rating này!');

    const result = await this.ratingRepository.insert({ ...createRatingDto, userId });
    if ((result.raw as ResultSetHeader).affectedRows !== 1)
      throw new InternalServerErrorException('Tạo đánh giá không thành công!');

    return { id: (result.raw as ResultSetHeader).insertId };
  }

  async update(userId: number, ratingId: number, updateRatingDto: UpdateRatingDto): Promise<void> {
    const existRating = await this.ratingRepository.existsBy({ userId, id: ratingId });
    if (!existRating) throw new NotFoundException(`Không tìm thấy rating với ID: ${ratingId}`);

    const result = await this.ratingRepository.update(
      {
        userId,
        id: ratingId,
      },
      updateRatingDto,
    );

    if (!result.affected || result.affected === 0)
      throw new InternalServerErrorException('Cập nhật đánh giá không thành công!');
  }

  async remove(ratingId: number, userId?: number) {
    const result = await this.ratingRepository.delete({ id: ratingId, userId });

    if (!result?.affected || result.affected === 0)
      throw new InternalServerErrorException('Xóa đánh giá không thành công!');
  }

  async findRatingsWithBookId(bookId: number): Promise<Rating[]> {
    const result = await this.ratingRepository.findBy({ bookId });

    return result;
  }

  async findByRatingIdWithUserId(ratingId: number, userId: number): Promise<Rating> {
    const result = await this.ratingRepository.findOneBy({ id: ratingId, userId });

    if (result === null) throw new NotFoundException(`Không tìm thấy rating với ID: ${ratingId}`);

    return result;
  }

  async findByRatingId(ratingId: number): Promise<Rating> {
    const result = await this.ratingRepository.findOneBy({ id: ratingId });

    if (result === null) throw new NotFoundException(`Không tìm thấy rating với ID: ${ratingId}`);

    return result;
  }

  async findAllByBookId(bookId: number): Promise<Rating[]> {
    const result = await this.ratingRepository.findBy({ bookId });

    return result;
  }

  async findAllByBookIdWithUserId(bookId: number, userId: number): Promise<Rating[]> {
    const result = await this.ratingRepository.findBy({ bookId, userId });

    return result;
  }

  async searchMyRatings(
    userId: number,
    { bookId, currentPage, limit, rating, sortBy, sortOrder }: UserSearchRatingDto,
  ) {}

  async filterRatings({
    bookId,
    currentPage,
    limit,
    rating,
    sortBy,
    sortOrder,
    userId,
  }: SearchRatingDto) {
    let where: any = { bookId, rating, userId };
    const ratings = await this.ratingRepository.find({
      where,
      order: { [sortBy]: sortOrder },
      take: limit,
      skip: currentPage && limit ? (currentPage - 1) * limit : undefined,
    });

    return ratings;
  }
}
