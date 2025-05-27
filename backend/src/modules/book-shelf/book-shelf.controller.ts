import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res } from '@nestjs/common';
import { BookShelfService } from './book-shelf.service';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import { ChangeBookShelfStatusDto } from './dto/change-book-shelf-status.dto';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { FilterBookShelfDto } from './dto/filter-bookShelf.dto';
import { ParseIntPositivePipe } from 'src/common/pipes/parse-int-positive.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('book-shelf')
export class BookShelfController {
  constructor(private readonly bookShelfService: BookShelfService) {}

  @Post()
  create(@Req() req: Request, @Body() createBookShelfDto: CreateBookShelfDto) {
    return this.bookShelfService.create((req?.user as User).id, createBookShelfDto);
  }

  @Get()
  filterMine(@Req() req: Request, @Query() filterData: FilterBookShelfDto) {
    const userId = (req?.user as User).id;
    return this.bookShelfService.filter(userId, filterData);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPositivePipe) id: number) {
    return this.bookShelfService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật trạng thái sách trong tủ sách thành công!')
  changeStatus(
    @Param('id', ParseIntPositivePipe) id: number,
    @Body() changeStatus: ChangeBookShelfStatusDto,
  ) {
    return this.bookShelfService.changeStatus(id, changeStatus);
  }

  @Delete(':id')
  @ResponseMessage('Xoá sách khỏi tủ sách thành công!')
  remove(@Req() req: Request, @Param('id', ParseIntPositivePipe) id: number) {
    return this.bookShelfService.remove((req?.user as User).id, id);
  }
}
