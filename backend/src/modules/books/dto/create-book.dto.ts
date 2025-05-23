import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { IsValidDate } from 'src/common/decorators/is-valid-date.decorator';
import { BookFormat, BookGenre } from 'src/entities/book.entity';

export default class CreateBookDto {
  @MaxLength(50, { message: 'tên tác giả không được vượt quá 50 kí tự' })
  @IsString({ message: 'tên tác giả phải là chuỗi' })
  @IsNotEmpty({ message: 'tên tác giả không được để trống' })
  author: string;

  @MaxLength(200, { message: 'tiêu đề sách không được vượt quá 200 kí tự' })
  @IsString({ message: 'tiêu đề sách phải là chuỗi' })
  @IsNotEmpty({ message: 'tiêu đề sách không được để trống' })
  title: string;

  @IsEnum(BookGenre, { message: 'thể loại sách không đúng định dạng' })
  @IsOptional()
  genre?: BookGenre;

  @MaxLength(1000, { message: 'mô tả sách không được vượt quá 1000 kí tự' })
  @IsString({ message: 'mô tả sách phải là chuỗi' })
  @IsOptional({ always: true })
  description?: string;

  @IsEnum(BookFormat, { message: `Phải có định dạng ${Object.values(BookFormat).join(' ,hoặc ')}` })
  @IsNotEmpty({ message: 'format sách không được để trống' })
  format: BookFormat;

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
}
