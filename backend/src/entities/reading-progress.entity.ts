import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './entity';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class ReadingProgress extends AbstractEntity {
  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  bookId: number;

  @Column({ type: 'smallint', default: 1, nullable: false })
  lastPage: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  lastOffset: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Book, (book) => book.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  book: Book;
}
