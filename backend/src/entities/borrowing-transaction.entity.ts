import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';
import { Fine } from './fine.entity';
import { AbstractEntity } from './entity';
import { Exclude } from 'class-transformer';

export enum TransactionType {
  ADMIN_BORROW = 'admin_borrow',
  USER_RESERVE = 'user_reserve',
}

export enum BorrowingTransactionStatus {
  CANCEL = 'canceled',
  PENDING = 'waiting',
  BORROWING = 'borrowing',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
  MISSING = 'book_missing',
}

export enum BorrowingTransactionSortType {
  BORROWED_AT = 'borrowedAt',
  DUE_DATE = 'dueDate',
  RETURNED_AT = 'returnedAt',
  BOOK_ID = 'bookId',
  UPDATED_AT = 'updatedAt',
}

export enum AdminBorrowingTransactionSortType {
  BORROWED_AT = 'borrowedAt',
  DUE_DATE = 'dueDate',
  RETURNED_AT = 'returnedAt',
  BOOK_ID = 'bookId',
  USER_ID = 'userId',
  UPDATED_AT = 'updatedAt',
  CREATED_BY = 'createdBy',
}

@Entity()
export class BorrowingTransaction extends AbstractEntity {
  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  bookId: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  transactionType: TransactionType;

  @Exclude()
  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ default: 0, type: 'tinyint', nullable: false })
  renewalCount: number;

  // let the user choose date to borrow a book
  @Column({ type: 'timestamp', nullable: true })
  borrowedAt?: Date;

  // it is assigned by service
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({
    type: 'enum',
    enum: BorrowingTransactionStatus,
    default: BorrowingTransactionStatus.PENDING,
    nullable: false,
  })
  status: BorrowingTransactionStatus = BorrowingTransactionStatus.PENDING;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt?: Date;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.borrowingTransactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @JoinColumn({ referencedColumnName: 'id', name: 'createdBy' })
  @ManyToOne(() => User, (user) => user.borrowingByUserId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  createdByUser: User;

  @JoinColumn()
  @ManyToOne(() => Book, (book) => book.borrowingTransactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  book: Book;

  @OneToOne(() => Fine, (fine) => fine.borrowingTransaction, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  fine: Fine;
}
