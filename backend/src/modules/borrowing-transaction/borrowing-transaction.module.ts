import { Module } from '@nestjs/common';
import { BorrowingTransactionService } from './borrowing-transaction.service';
import { BorrowingTransactionController } from './borrowing-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingTransaction } from 'src/entities/borrowing-transaction.entity';
import { BooksModule } from '../books/books.module';
import { FinesModule } from '../fines/fines.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [BorrowingTransactionController],
  providers: [BorrowingTransactionService],
  imports: [
    TypeOrmModule.forFeature([BorrowingTransaction]),
    BooksModule,
    FinesModule,
    UsersModule,
  ],
  exports: [TypeOrmModule, BorrowingTransactionService],
})
export class BorrowingTransactionModule {}
