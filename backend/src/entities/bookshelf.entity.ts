import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';
import { AbstractEntity } from './entity';

export enum BookshelfStatus {
  READ = 'read',
  CURRENTLY_READING = 'currently_reading',
  WANT_TO_READ = 'want_to_read',
  FAVORITE = 'favorite',
}

export enum BookshelfSortType {
  USER_ID = 'userId',
  BOOK_ID = 'bookId',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

@Entity()
export class Bookshelf extends AbstractEntity {
  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  bookId: number;

  @Column({ type: 'enum', enum: BookshelfStatus, nullable: true })
  status?: BookshelfStatus;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.bookshelf, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @JoinColumn()
  @ManyToOne(() => Book, (book) => book.bookshelf, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  book: Book;
}
