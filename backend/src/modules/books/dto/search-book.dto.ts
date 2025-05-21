import { IsDecimal, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BookFormat, BookGenre, BookSortType } from 'src/entities/book.entity';
import { IsValidDate } from 'src/common/decorators/is-valid-date.decorator';
import PaginateDto from 'src/common/dto/paginate.dto';
import { Type } from 'class-transformer';

export default class SearchBookDto extends PaginateDto {
  @MaxLength(50, { message: 'tên tác giả không được vượt quá 50 kí tự' })
  @IsString({ message: 'tên tác giả phải là chuỗi' })
  @IsOptional({ always: true })
  author?: string;

  @MaxLength(200, { message: 'tiêu đề sách không được vượt quá 200 kí tự' })
  @IsString({ message: 'tiêu đề sách phải là chuỗi' })
  @IsOptional({ always: true })
  title?: string;

  @IsEnum(BookGenre, { message: 'thể loại sách không đúng định dạng' })
  @IsOptional({ always: true })
  genre?: BookGenre;

  @IsEnum(BookFormat, { message: `Phải có định dạng ${Object.keys(BookFormat).join(' ,hoặc ')}` })
  @IsOptional({ always: true })
  format?: BookFormat;

  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'số lượng sách phải là số nguyên dương' })
  @Type(() => Number)
  @IsOptional({ always: true })
  stock?: number;

  @IsValidDate()
  @IsOptional()
  publishedDate?: Date;

  @IsDecimal({ decimal_digits: '2,2' }, { message: 'phiên bản sách phải có định dạng DD.dd' })
  @IsOptional({ always: true })
  version?: number;

  @IsEnum(BookSortType, {
    message: `sortBy phải là ${Object.values(BookSortType).join(' hoặc ')}.`,
  })
  sortBy: BookSortType = BookSortType.PUBLISHED_DATE;
}
