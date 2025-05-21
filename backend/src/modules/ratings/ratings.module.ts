import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from 'src/entities/rating.entity';
import { BooksModule } from '../books/books.module';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService],
  imports: [TypeOrmModule.forFeature([Rating]), BooksModule],
  exports: [TypeOrmModule, RatingsService],
})
export class RatingsModule {}
