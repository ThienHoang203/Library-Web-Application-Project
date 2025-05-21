import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BorrowingTransaction,
  BorrowingTransactionStatus,
  TransactionType,
} from 'src/entities/borrowing-transaction.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateBorrowingTransactionDto } from './dto/create-borrowing-transaction.dto';
import { Book } from 'src/entities/book.entity';
import { BorrowingTransactionDto } from './dto/borrowing-transaction.dto';
import { BORROWING_TRANSACTION } from 'src/common/utils/constants';
import { AdminCreateBorrowingTransactionDto } from './dto/admin-create-borrowing-transaction.dto';
import { UsersService } from '../users/users.service';
import PaginateDto from 'src/common/dto/paginate.dto';
import { AdminFilterTransactionDto } from './dto/admin-filter-transaction.dto';
import { buildDateRange } from 'src/common/utils/functions';
import { BooksService } from '../books/books.service';

@Injectable()
export class BorrowingTransactionService {
  constructor(
    @InjectRepository(BorrowingTransaction)
    private readonly borrowingTransactionRepository: Repository<BorrowingTransaction>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly userService: UsersService,

    private readonly bookService: BooksService,
  ) {}

  async checkValidBookToBorrow(bookId: number) {
    const book = await this.bookRepository.findOneBy({ id: bookId });
    console.log({ book });

    if (!book) throw new NotFoundException(`Không tìm thấy sách ID: ${bookId}`);

    if (book.stock < 1) throw new ConflictException('Không còn sách!');

    if (book.waitingBorrowCount + 1 > book.stock) throw new ConflictException('Không đủ sách!');

    return book;
  }

  async create(userId: number, { bookId, borrowedAt }: CreateBorrowingTransactionDto) {
    if (!borrowedAt) borrowedAt = new Date(Date.now() + BORROWING_TRANSACTION.DEFAULT_BORROW_AT);

    const book = await this.checkValidBookToBorrow(bookId);

    const oldCount = book.waitingBorrowCount;

    book.waitingBorrowCount += 1;

    const bookUpdateResult = await this.bookRepository.save(book);

    if (oldCount >= bookUpdateResult.waitingBorrowCount) {
      throw new InternalServerErrorException('Cập nhật hàng chờ mượn sách không thành công');
    }

    return await this.createTransaction({
      bookId,
      borrowedAt,
      userId,
      createdBy: userId,
      status: BorrowingTransactionStatus.PENDING,
      transactionType: TransactionType.USER_RESERVE,
    });
  }

  async createForAdmin(
    adminId: number,

    { bookId, borrowedAt, borrowerId }: AdminCreateBorrowingTransactionDto,
  ) {
    await this.userService.existUser(borrowerId);

    if (!borrowedAt) borrowedAt = new Date(Date.now() + BORROWING_TRANSACTION.DEFAULT_BORROW_AT);

    const book = await this.checkValidBookToBorrow(bookId);

    const oldCount = book.stock;

    book.stock -= 1;
    const bookUpdateResult = await this.bookRepository.save(book);

    if (oldCount <= bookUpdateResult.stock) {
      throw new InternalServerErrorException('Tạo giao dịch không thành công');
    }

    return await this.createTransaction({
      bookId,
      borrowedAt,
      userId: borrowerId,
      createdBy: adminId,
      status: BorrowingTransactionStatus.BORROWING,
      transactionType: TransactionType.ADMIN_BORROW,
    });
  }

  async createTransaction(createData: BorrowingTransactionDto) {
    if (createData?.borrowedAt) {
      console.log({
        date: createData.borrowedAt?.getTime(),
      });
      createData.dueDate = new Date(
        createData.borrowedAt?.getTime() + BORROWING_TRANSACTION.DUE_DATE,
      );
    }

    const result = await this.borrowingTransactionRepository.insert({ ...createData });

    if (result.identifiers.length < 1)
      throw new InternalServerErrorException('Tạo mới giao dịch mượn không thành công!');

    return { id: result.identifiers[0]?.id };
  }

  async getTransactionsByUserId(userId: number, { currentPage, limit, ...data }: PaginateDto) {
    const transactions = await this.borrowingTransactionRepository.find({
      where: { userId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: currentPage && limit ? (currentPage - 1) * limit : undefined,
    });

    return transactions;
  }

  async filterTransactions({
    currentPage,
    limit,
    sortBy,
    sortOrder,
    bookId,
    createdBy,
    status,
    timeCategory,
    transactionType,
    typeTime,
    userId,
    timeValue,
  }: AdminFilterTransactionDto) {
    if (typeTime && timeCategory && timeValue) {
      const { start, end } = buildDateRange(typeTime, timeValue);

      let queryBuilder = this.borrowingTransactionRepository.createQueryBuilder('tr');

      queryBuilder = queryBuilder.where(`tr.${timeCategory} BETWEEN :start AND :end`, {
        start,
        end,
      });

      if (bookId) queryBuilder = queryBuilder.andWhere('tr.bookId = :bookId', { bookId });

      if (userId) queryBuilder = queryBuilder.andWhere('tr.userId = :userId', { userId });

      if (createdBy)
        queryBuilder = queryBuilder.andWhere('tr.createdBy = :createdBy', { createdBy });

      if (status) queryBuilder = queryBuilder.andWhere('tr.status = :status', { status });

      if (transactionType)
        queryBuilder = queryBuilder.andWhere('tr.transactionType = :transactionType', {
          transactionType,
        });

      queryBuilder = queryBuilder.orderBy(
        `tr.${sortBy}`,
        sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );

      queryBuilder = queryBuilder.take(limit);

      queryBuilder = queryBuilder.skip(
        currentPage && limit ? (currentPage - 1) * limit : undefined,
      );

      const result = await queryBuilder.getMany();

      return result;
    } else {
      let where: any = {};
      if (bookId) where.bookId = bookId;
      if (userId) where.userId = userId;
      if (createdBy) where.createdBy = createdBy;
      if (status) where.status = status;
      if (transactionType) where.transactionType = transactionType;

      const transactions = await this.borrowingTransactionRepository.find({
        where,
        order: sortBy ? { [sortBy]: sortOrder ? sortOrder : 'desc' } : { created_at: 'DESC' },
        take: limit,
        skip: currentPage && limit ? (currentPage - 1) * limit : undefined,
      });

      return transactions;
    }
  }

  async getTransactionById(transactionId: number, borrowerId?: number) {
    const transaction = await this.borrowingTransactionRepository.findOne({
      where: { id: transactionId, ...(borrowerId ? { userId: borrowerId } : {}) },
    });

    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch mượn sách!');

    return transaction;
  }

  async cancelTransaction(transactionId: number, borrowerId?: number) {
    const transaction = await this.borrowingTransactionRepository.findOneBy({
      id: transactionId,
      userId: borrowerId,
      status: BorrowingTransactionStatus.PENDING,
    });

    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch!');

    const book = await this.bookService.findById(transaction.bookId);

    const bookUpdateResult = await this.bookRepository.update(book.id, {
      waitingBorrowCount: book.waitingBorrowCount - 1,
    });

    if (!bookUpdateResult.affected || bookUpdateResult.affected < 1)
      throw new InternalServerErrorException('Hủy giao dịch sách không thành công!');

    const result = await this.borrowingTransactionRepository.update(transactionId, {
      status: BorrowingTransactionStatus.CANCEL,
    });

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('Hủy giao dịch sách không thành công!');
  }

  async acceptTransaction(transactionId: number) {
    const transaction = await this.borrowingTransactionRepository.findOneBy({
      id: transactionId,
      status: BorrowingTransactionStatus.PENDING,
    });

    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch!');

    const book = await this.bookService.findById(transaction.bookId);

    const bookUpdateResult = await this.bookRepository.update(book.id, {
      waitingBorrowCount: book.waitingBorrowCount - 1,
      stock: book.stock - 1,
    });

    if (!bookUpdateResult.affected || bookUpdateResult.affected < 1)
      throw new InternalServerErrorException('Chấp nhận giao dịch sách không thành công!');

    const result = await this.borrowingTransactionRepository.update(transactionId, {
      status: BorrowingTransactionStatus.BORROWING,
    });

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('Chấp nhận giao dịch sách không thành công!');
  }

  async returnTransaction(transactionId: number) {
    const transaction = await this.borrowingTransactionRepository.findOneBy({
      id: transactionId,
      status: Not(In([BorrowingTransactionStatus.PENDING, BorrowingTransactionStatus.CANCEL])),
    });

    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch!');

    const book = await this.bookService.findById(transaction.bookId);

    const bookUpdateResult = await this.bookRepository.update(book.id, {
      stock: book.stock + 1,
    });

    if (!bookUpdateResult.affected || bookUpdateResult.affected < 1)
      throw new InternalServerErrorException('Cập nhật giao dịch sách không thành công!');

    const result = await this.borrowingTransactionRepository.update(transactionId, {
      status: BorrowingTransactionStatus.RETURNED,
    });

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('Cập nhật giao dịch sách không thành công!');
  }
}
