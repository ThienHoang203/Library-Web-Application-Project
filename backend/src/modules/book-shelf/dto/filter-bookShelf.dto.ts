import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import PaginateDto from 'src/common/dto/paginate.dto';
import { BookshelfSortType, BookshelfStatus } from 'src/entities/bookshelf.entity';

export class FilterBookShelfDto extends PaginateDto {
  @Min(0, { message: 'không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsOptional()
  bookId?: number;

  @IsEnum(BookshelfStatus, {
    message: `Phải có định dạng ${Object.values(BookshelfStatus).join(' ,hoặc ')}`,
  })
  @IsOptional()
  status?: BookshelfStatus;

  @IsEnum(BookshelfSortType, {
    message: `Phải có định dạng ${Object.values(BookshelfSortType).join(' ,hoặc ')}`,
  })
  @IsOptional()
  sortBy: BookshelfSortType = BookshelfSortType.CREATED_AT;
}
