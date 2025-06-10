import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { BookshelfStatus } from 'src/entities/bookshelf.entity';

export class CreateBookShelfDto {
  @Min(0, { message: 'không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'bookId không được để trống' })
  bookId: number;

  @IsEnum(BookshelfStatus, {
    message: `Phải có định dạng ${Object.values(BookshelfStatus).join(' ,hoặc ')}`,
  })
  @IsOptional()
  status?: BookshelfStatus = BookshelfStatus.FAVORITE;
}
