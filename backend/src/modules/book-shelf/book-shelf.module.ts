import { Module } from '@nestjs/common';
import { BookShelfService } from './book-shelf.service';
import { BookShelfController } from './book-shelf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { BooksModule } from '../books/books.module';

@Module({
  controllers: [BookShelfController],
  imports: [TypeOrmModule.forFeature([Bookshelf]), BooksModule],
  exports: [TypeOrmModule],
  providers: [BookShelfService],
})
export class BookShelfModule {}
