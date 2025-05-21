import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { BookShelfService } from './book-shelf.service';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import { UpdateBookShelfDto } from './dto/update-book-shelf.dto';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { FilterBookShelfDto } from './dto/filter-bookShelf.dto';

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
  findOne(@Param('id') id: string) {
    return this.bookShelfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookShelfDto: UpdateBookShelfDto) {
    return this.bookShelfService.update(+id, updateBookShelfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookShelfService.remove(+id);
  }
}
