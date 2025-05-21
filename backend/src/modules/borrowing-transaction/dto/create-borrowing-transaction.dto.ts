import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { IsValidBorrowDate } from 'src/common/decorators/is-valid-borrow-date.decorator';

export class CreateBorrowingTransactionDto {
  @Min(0, { message: 'không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'bookId không được để trống' })
  bookId: number;

  @Type(() => Date)
  @IsValidBorrowDate()
  @IsOptional()
  borrowedAt?: Date;
}
