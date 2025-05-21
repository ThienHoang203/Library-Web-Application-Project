import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { CreateBorrowingTransactionDto } from './create-borrowing-transaction.dto';
import { Type } from 'class-transformer';

export class AdminCreateBorrowingTransactionDto extends CreateBorrowingTransactionDto {
  @Min(0, { message: 'không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên lớn hơn 0' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'userId không được để trống' })
  borrowerId: number;
}
