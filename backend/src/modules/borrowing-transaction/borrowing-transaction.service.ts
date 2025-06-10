import {
  BadRequestException,
  ConflictException,
  HttpStatus,
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
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { CreateBorrowingTransactionDto } from './dto/create-borrowing-transaction.dto';
import { Book, BookFormat } from 'src/entities/book.entity';
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

    private readonly dataSource: DataSource,
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

    return this.dataSource.transaction(async (manager: EntityManager) => {
      // Check if the book is valid to borrow
      const book = await this.validateBookForUpdate(manager, bookId);

      // Increase the waiting borrow count of the book by 1
      // If the stock is not updated successfully, throw InternalServerErrorException
      const bookUpdateResult = await manager.update(
        Book,
        { id: bookId },
        { waitingBorrowCount: book.waitingBorrowCount + 1 },
      );
      if (!bookUpdateResult.affected || bookUpdateResult.affected < 1)
        throw new InternalServerErrorException('Cập nhật sách không thành công!');

      // Create a new borrowing transaction
      return await this.createTransaction(manager, {
        bookId,
        borrowedAt,
        userId,
        createdBy: userId,
        status: BorrowingTransactionStatus.PENDING,
        transactionType: TransactionType.USER_RESERVE,
      });
    });
  }

  async createForAdmin(
    adminId: number,

    { bookId, borrowedAt, borrowerId }: AdminCreateBorrowingTransactionDto,
  ) {
    await this.userService.existUser(borrowerId);

    if (!borrowedAt) borrowedAt = new Date(Date.now() + BORROWING_TRANSACTION.DEFAULT_BORROW_AT);
    console.log({ borrowedAt });

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      // Check if the book is valid to borrow
      const book = await this.validateBookForUpdate(manager, bookId);

      // Decrease the stock of the book by 1
      // If the stock is not updated successfully, throw InternalServerErrorException
      const bookUpdateResult = await manager.update(
        Book,
        { id: bookId },
        { stock: book.stock - 1 },
      );
      if (!bookUpdateResult.affected || bookUpdateResult.affected < 1)
        throw new InternalServerErrorException('Cập nhật sách không thành công!');

      //Create a new borrowing transaction
      return await this.createTransaction(manager, {
        bookId,
        borrowedAt,
        userId: borrowerId,
        createdBy: adminId,
        status: BorrowingTransactionStatus.BORROWING,
        transactionType: TransactionType.ADMIN_BORROW,
      });
    });
  }

  async validateBookForUpdate(manager: EntityManager, bookId: number): Promise<Book> {
    const book = await manager.findOne(Book, {
      where: { id: bookId },
      lock: { mode: 'pessimistic_write' },
    });

    // Check if book exists
    // If book does not exist, throw NotFoundException
    if (!book) {
      throw new NotFoundException({
        message: `Không tồn tại bookId: ${bookId}`,
        bookId: bookId,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // Check if book is a physical book
    // If book is not a physical book, throw BadRequestException
    if (book.format !== BookFormat.PHYS)
      throw new BadRequestException(`BookId: ${bookId} không phải sách in!`);

    //check if this book's stock is lower than 1 or the borrowing queue is not less than the stock, this request has to cancel!
    // If book's stock is lower than 1 or the borrowing queue is not less than the stock, throw BadRequestException
    if (book.stock < 1 || book.stock <= book.waitingBorrowCount) {
      throw new BadRequestException({
        message: 'Số lượng sách không đủ',
        bookId: bookId,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return book;
  }

  async createTransaction(manager: EntityManager, createData: BorrowingTransactionDto) {
    // If borrowedAt is provided, set due date
    if (createData?.borrowedAt) {
      createData.dueDate = new Date(
        createData.borrowedAt?.getTime() + BORROWING_TRANSACTION.DUE_DATE,
      );
    }

    const result = await manager.insert(BorrowingTransaction, { ...createData });

    if (result.identifiers.length < 1)
      throw new InternalServerErrorException('Tạo mới giao dịch mượn không thành công!');

    return { id: result.identifiers[0]?.id };
  }

  async getTransactionsByUserId(userId: number, { currentPage, limit, ...data }: PaginateDto) {
    const transactions = await this.borrowingTransactionRepository.find({
      where: { userId },
      order: { created_at: 'DESC' },
      relations: ['user', 'book'],
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
    const queryBuilder = this.borrowingTransactionRepository.createQueryBuilder('bt');
    queryBuilder
      .select(BORROWING_TRANSACTION.BORROWING_TRANSACTION_FIELDS)
      .leftJoin('bt.user', 'u')
      .addSelect(BORROWING_TRANSACTION.USER_FIELDS)
      .leftJoin('bt.book', 'b')
      .addSelect(BORROWING_TRANSACTION.ADMIN_BOOK_FIELDS);

    if (typeTime && timeCategory && timeValue) {
      const { start, end } = buildDateRange(typeTime, timeValue);

      queryBuilder.where(`tr.${timeCategory} BETWEEN :start AND :end`, {
        start,
        end,
      });
    }

    if (bookId) queryBuilder.andWhere('bt.bookId = :bookId', { bookId });

    if (userId) queryBuilder.andWhere('bt.userId = :userId', { userId });

    if (createdBy) queryBuilder.andWhere('bt.createdBy = :createdBy', { createdBy });

    if (status) queryBuilder.andWhere('bt.status = :status', { status });

    if (transactionType)
      queryBuilder.andWhere('bt.transactionType = :transactionType', {
        transactionType,
      });

    queryBuilder.orderBy(`bt.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    queryBuilder.take(limit);

    queryBuilder.skip(currentPage && limit ? (currentPage - 1) * limit : undefined);

    const result = await queryBuilder.getMany();

    return result;
  }

  async getTransactionById(transactionId: number, borrowerId?: number) {
    const query = this.borrowingTransactionRepository
      .createQueryBuilder('bt')
      .select(BORROWING_TRANSACTION.BORROWING_TRANSACTION_FIELDS)
      .leftJoin('bt.user', 'u')
      .addSelect(BORROWING_TRANSACTION.USER_FIELDS)
      .where('bt.id = :transactionId', { transactionId })
      .leftJoin('bt.book', 'b');
    if (borrowerId) {
      query
        .andWhere('bt.userId = :borrowerId', { borrowerId })
        .addSelect(BORROWING_TRANSACTION.BOOK_FIELDS);
    } else {
      query.addSelect(BORROWING_TRANSACTION.ADMIN_BOOK_FIELDS);
    }

    query.orderBy('bt.created_at', 'DESC');

    const transaction = await query.getOne();

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

  async extendTransaction(transactionId: number, borrowerId?: number) {
    const transaction = await this.borrowingTransactionRepository.findOneBy({
      id: transactionId,
      userId: borrowerId,
      status: BorrowingTransactionStatus.BORROWING,
    });

    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch!');

    const result = await this.borrowingTransactionRepository.update(transactionId, {
      dueDate: new Date(Date.now() + BORROWING_TRANSACTION.DUE_DATE),
    });

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException('Gia hạn giao dịch sách không thành công!');

    return { id: transaction.id };
  }

  deleteTransaction(transactionId: number) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const transaction = await manager.findOne(BorrowingTransaction, {
        where: { id: transactionId },
        relations: ['book'],
      });

      if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch!');

      // If the transaction is not in PENDING or CANCEL status, throw BadRequestException
      if (
        transaction.status !== BorrowingTransactionStatus.PENDING &&
        transaction.status !== BorrowingTransactionStatus.CANCEL
      )
        throw new BadRequestException('Giao dịch không thể hủy!');

      // Update the book's waiting borrow count
      const bookUpdateResult = await manager.update(
        Book,
        { id: transaction.bookId },
        { waitingBorrowCount: transaction.book.waitingBorrowCount - 1 },
      );

      if (!bookUpdateResult.affected || bookUpdateResult.affected < 1)
        throw new InternalServerErrorException('Cập nhật sách không thành công!');

      // Delete the transaction
      const deleteResult = await manager.delete(BorrowingTransaction, { id: transactionId });

      if (!deleteResult.affected || deleteResult.affected < 1)
        throw new InternalServerErrorException('Xóa giao dịch không thành công!');

      return { id: transactionId };
    });
  }
}
