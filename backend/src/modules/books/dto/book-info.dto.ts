import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { Book } from 'src/entities/book.entity';

export class BookInfoDto extends Book {
  @Exclude()
  waitingBorrowCount: number;
}
