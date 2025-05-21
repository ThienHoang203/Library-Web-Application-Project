import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import PaginateDto from 'src/common/dto/paginate.dto';

import {
  AdminBorrowingTransactionSortType,
  BorrowingTransactionStatus,
  TransactionType,
} from 'src/entities/borrowing-transaction.entity';

export enum TransactionTypeTime {
  DATE = 'date',
  MONTH = 'month',
  YEAR = 'year',
}

export enum TransactionTimeCategory {
  RETURNED_AT = 'returnedAt',
  DUE_DATE = 'dueDate',
  BORROWED_AT = 'borrowedAt',
}

export class AdminFilterTransactionDto extends PaginateDto {
  @IsEnum(AdminBorrowingTransactionSortType, {
    message: `sortOrder phải là ${Object.values(AdminBorrowingTransactionSortType).join(' hoặc ')}.`,
  })
  sortBy: AdminBorrowingTransactionSortType = AdminBorrowingTransactionSortType.BORROWED_AT;

  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'số lượng sách phải là số nguyên dương' })
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'số lượng sách phải là số nguyên dương' })
  @Type(() => Number)
  @IsOptional()
  bookId?: number;

  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'số lượng sách phải là số nguyên dương' })
  @Type(() => Number)
  @IsOptional()
  createdBy?: number;

  @IsEnum(TransactionType, {
    message: `transactionType phải là ${Object.values(TransactionType).join(' hoặc ')}.`,
  })
  @IsOptional()
  transactionType?: TransactionType;

  @IsEnum(BorrowingTransactionStatus, {
    message: `status phải là ${Object.values(BorrowingTransactionStatus).join(' hoặc ')}.`,
  })
  @IsOptional()
  status?: BorrowingTransactionStatus;

  @IsEnum(TransactionTypeTime, {
    message: `typeTime phải là ${Object.values(TransactionTypeTime).join(' hoặc ')}.`,
  })
  @IsOptional()
  typeTime?: TransactionTypeTime;

  @IsEnum(TransactionTimeCategory, {
    message: `timeCategory phải là ${Object.values(TransactionTimeCategory).join(' hoặc ')}.`,
  })
  @IsOptional()
  timeCategory?: TransactionTimeCategory;

  @IsDateString({ strict: true })
  @IsOptional()
  timeValue: string;
}
