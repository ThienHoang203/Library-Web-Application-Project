import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './entity';
import { User } from './user.entity';
import { BorrowingTransaction } from './borrowing-transaction.entity';

export enum FineType {
  OVERDUE = 'overdue',
  MISSING = 'missing',
  DAMAGED = 'damaged',
}

@Entity()
export class Fine extends AbstractEntity {
  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: true })
  borrowingTransactionId?: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: false })
  amount: number;

  @Column({ type: 'bool', default: false, nullable: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.fines, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @JoinColumn()
  @OneToOne(() => BorrowingTransaction, (borrowingTransaction) => borrowingTransaction.fine, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  borrowingTransaction: BorrowingTransaction;
}
