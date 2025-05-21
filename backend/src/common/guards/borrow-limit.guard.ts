import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import {
  BorrowingTransaction,
  BorrowingTransactionStatus,
} from 'src/entities/borrowing-transaction.entity';
import { Fine } from 'src/entities/fine.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { And, In, Not, Repository } from 'typeorm';
import { BORROWING_TRANSACTION } from '../utils/constants';
import { ParseIntPositivePipe } from '../pipes/parse-int-positive.pipe';

@Injectable()
export class BorrowLimitGuard implements CanActivate {
  constructor(
    @InjectRepository(BorrowingTransaction)
    private borrowingTransactionRepository: Repository<BorrowingTransaction>,
    @InjectRepository(Fine)
    private fineRepository: Repository<Fine>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as User;

    let borrowerId: number = user.id;

    if (user.role === UserRole.ADMIN) {
      const body = request.body;
      if (body?.borrowerId) {
        borrowerId = new ParseIntPositivePipe().transform(body.borrowerId);
      } else {
        throw new ForbiddenException('Vui lòng cung cấp Id của người mượn!');
      }
    }

    const body = request.body;

    if (body?.bookId) {
      const hasTransaction = await this.borrowingTransactionRepository.exists({
        where: {
          userId: borrowerId,
          bookId: body.bookId,
          status: Not(In([BorrowingTransactionStatus.CANCEL, BorrowingTransactionStatus.RETURNED])),
        },
      });

      if (hasTransaction) {
        throw new ConflictException(
          'Giao dịch mượn sách của bạn đã tồn tại và hợp lệ, vui lòng đến thư viện để lấy sách!',
        );
      }
    }

    const hasAnyFines = await this.fineRepository.existsBy({ isPaid: false, userId: borrowerId });
    if (hasAnyFines) throw new ForbiddenException('Vui lòng thanh toán các khoản phạt!');

    const currentBorrows = await this.borrowingTransactionRepository.count({
      where: [
        { userId: borrowerId, status: Not(BorrowingTransactionStatus.CANCEL) },
        { userId: borrowerId, status: Not(BorrowingTransactionStatus.RETURNED) },
      ],
    });

    if (currentBorrows >= BORROWING_TRANSACTION.MAX_BORROWING_BOOK) {
      throw new ForbiddenException('Bạn đã đạt giới hạn mượn sách.');
    }

    return true;
  }
}
