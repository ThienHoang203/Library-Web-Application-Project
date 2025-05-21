import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateReadingProgressDto {
  @Min(0, { message: 'không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'bookId không được để trống' })
  bookId: number;

  @Min(1, { message: 'không được bé hơn 1' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'tiêu đề sách không được để trống' })
  lastPage: number = 1;

  @Min(0, { message: 'không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsOptional()
  lastOffset: number = 0;
}
