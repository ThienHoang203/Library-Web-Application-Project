import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BorrowingTransactionService } from './borrowing-transaction.service';
import { Request } from 'express';
import { User, UserRole } from 'src/entities/user.entity';
import { CreateBorrowingTransactionDto } from './dto/create-borrowing-transaction.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BorrowLimitGuard } from 'src/common/guards/borrow-limit.guard';
import { AdminCreateBorrowingTransactionDto } from './dto/admin-create-borrowing-transaction.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParseIntPositivePipe } from 'src/common/pipes/parse-int-positive.pipe';
import { instanceToPlain } from 'class-transformer';
import PaginateDto from 'src/common/dto/paginate.dto';
import { AdminFilterTransactionDto } from './dto/admin-filter-transaction.dto';

@Controller('borrowing-transaction')
export class BorrowingTransactionController {
  constructor(private readonly borrowingTransactionService: BorrowingTransactionService) {}

  //create borrowing transaction for normal users
  @Post()
  @ResponseMessage('Tạo mới giao dịch mượn thành công.')
  @UseGuards(BorrowLimitGuard)
  createBorrowingTransaction(@Req() req: Request, @Body() body: CreateBorrowingTransactionDto) {
    return this.borrowingTransactionService.create((req?.user as User).id, body);
  }

  //create borrowing transaction for admin
  @Post('admin')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Tạo mới giao dịch mượn thành công.')
  @UseGuards(BorrowLimitGuard)
  createBorrowingTransactionForAdmin(
    @Req() req: Request,
    @Body() body: AdminCreateBorrowingTransactionDto,
  ) {
    return this.borrowingTransactionService.createForAdmin((req?.user as User).id, body);
  }

  @Get()
  async getMyTransactions(@Req() req: Request, @Query() query: PaginateDto) {
    const result = await this.borrowingTransactionService.getTransactionsByUserId(
      (req?.user as User).id,
      query,
    );

    return instanceToPlain(result);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  async filterTransactions(@Query() query: AdminFilterTransactionDto) {
    const result = await this.borrowingTransactionService.filterTransactions(query);

    return result;
  }

  @Get(':id')
  async getTransactionById(
    @Req() req: Request,
    @Param('id', ParseIntPositivePipe) transationId: number,
  ) {
    const user = req?.user as User;
    const borrowerId = user.role === UserRole.ADMIN ? undefined : user.id;
    const result = await this.borrowingTransactionService.getTransactionById(
      transationId,
      borrowerId,
    );

    return user.role === UserRole.ADMIN ? result : instanceToPlain(result);
  }

  @Patch(':id/cancel')
  @ResponseMessage('Hủy giao dịch mượn sách thành công!')
  async cancelTransaction(
    @Req() req: Request,
    @Param('id', ParseIntPositivePipe) transactionId: number,
  ) {
    const user = req.user as User;

    const borrowerId = user.role === UserRole.ADMIN ? undefined : user.id;

    return this.borrowingTransactionService.cancelTransaction(transactionId, borrowerId);
  }

  @Patch(':id/accept')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Chấp nhận giao dịch mượn sách thành công!')
  async acceptTransaction(@Param('id', ParseIntPositivePipe) transactionId: number) {
    return this.borrowingTransactionService.acceptTransaction(transactionId);
  }

  @Patch(':id/return')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Chấp nhận giao dịch mượn sách thành công!')
  async returnTransaction(@Param('id', ParseIntPositivePipe) transactionId: number) {
    return this.borrowingTransactionService.returnTransaction(transactionId);
  }

  @Patch(':id/extend')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Gia hạn giao dịch mượn sách thành công!')
  async extendTransaction(
    @Req() req: Request,
    @Param('id', ParseIntPositivePipe) transactionId: number,
  ) {
    const user = req.user as User;

    const borrowerId = user.role === UserRole.ADMIN ? undefined : user.id;

    return this.borrowingTransactionService.extendTransaction(transactionId, borrowerId);
  }
}
