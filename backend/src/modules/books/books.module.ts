import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/config/file.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { ReadingProgress } from 'src/entities/reading-progress.entity';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    TypeOrmModule.forFeature([Book, ReadingProgress]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
