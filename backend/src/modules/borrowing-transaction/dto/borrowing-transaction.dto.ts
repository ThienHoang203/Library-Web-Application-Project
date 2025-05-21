import {
  BorrowingTransactionStatus,
  TransactionType,
} from 'src/entities/borrowing-transaction.entity';

export class BorrowingTransactionDto {
  userId?: number;

  bookId?: number;

  transactionType?: TransactionType;

  createdBy?: number;

  borrowedAt?: Date = new Date();

  dueDate?: Date;

  returnedAt?: Date;

  status?: BorrowingTransactionStatus = BorrowingTransactionStatus.PENDING;
}
