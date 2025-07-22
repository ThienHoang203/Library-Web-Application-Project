import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Patch,
  Param,
  Delete,
  Get,
  NotFoundException,
  Res,
  Query,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User, UserRole } from 'src/entities/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import CreateBookDto from './dto/create-book.dto';
import { BookFormat } from 'src/entities/book.entity';
import { EbookValidationPipe } from 'src/common/pipes/ebook-validation.pipe';
import { createFilename } from 'src/common/utils/functions';
import { Public } from 'src/common/decorators/public-route.decorator';
import { CoverImageValidationPipe } from 'src/common/pipes/cover-image-validation.pipe';
import { UpdateBookDto } from './dto/update-book.dto';
import { ParseIntPositivePipe } from 'src/common/pipes/parse-int-positive.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { join, parse } from 'path';
import { FILE_CONSTANTS } from 'src/common/utils/constants';
import * as fs from 'fs';
import { Request, Response } from 'express';
import SearchBookDto from './dto/search-book.dto';
import { plainToInstance } from 'class-transformer';
import { BookInfoDto } from './dto/book-info.dto';
import { QueryNotNullPipe } from 'src/common/pipes/query-not-null.pipe';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';

@Roles(UserRole.ADMIN)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  //create a new book
  @Post()
  @ResponseMessage('Thêm sách mới thành công.')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ebookFile', maxCount: 1 },
        { name: 'coverImageFile', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          // the max number of fields which are not file-field
          fields: 8,
          // the max number of file-fields
          files: 2,
        },
      },
    ),
  )
  async create(
    @UploadedFiles()
    {
      ebookFile,
      coverImageFile,
    }: { ebookFile?: Express.Multer.File[]; coverImageFile?: Express.Multer.File[] },
    @Body()
    bookData: CreateBookDto,
  ) {
    const fileNames: { coverImageFilename: string | undefined; ebookFilename: string | undefined } =
      {
        coverImageFilename: undefined,
        ebookFilename: undefined,
      };

    //create object files to store file after validation
    const files: {
      coverImageFile: Express.Multer.File[] | null;
      ebookFile: Express.Multer.File[] | null;
    } = {
      coverImageFile: null,
      ebookFile: null,
    };

    //Create pipes to validate files
    const ebookPipe = new EbookValidationPipe();
    const coverImagePipe = new CoverImageValidationPipe();

    // Validate files
    files.ebookFile = ebookPipe.transform(ebookFile);
    files.coverImageFile = coverImagePipe.transform(coverImageFile);

    //Check if format is physic, there's no longer ebook file
    if (bookData.format === BookFormat.PHYS && files.ebookFile)
      throw new BadRequestException('Ebook không được có trong sách bản in!');

    //if there is ebook file, create filename
    if (files.ebookFile) fileNames.ebookFilename = createFilename(files.ebookFile[0]);

    //if there is cover image file, create filename
    if (files.coverImageFile) {
      fileNames.coverImageFilename = createFilename(files.coverImageFile[0]);
    }

    return this.booksService.create(
      bookData,
      files.ebookFile,
      files.coverImageFile,
      fileNames.ebookFilename,
      fileNames.coverImageFilename,
    );
  }

  @Patch(':bookId')
  @ResponseMessage('Cập nhật sách thành công.')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ebookFile', maxCount: 1 },
        { name: 'coverImageFile', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          // the max number of fields which are not file-fields
          fields: 7,
          // the max number of file-fields
          files: 2,
        },
      },
    ),
  )
  async update(
    @UploadedFiles()
    {
      ebookFile,
      coverImageFile,
    }: { ebookFile?: Express.Multer.File[]; coverImageFile?: Express.Multer.File[] },
    @Body()
    bookData: UpdateBookDto,
    @Param('bookId', ParseIntPositivePipe) bookId: number,
  ) {
    if (!bookData && !coverImageFile && !ebookFile)
      throw new BadRequestException('Không có dữ liệu để cập nhật!');

    //create object files to store file after validation
    const files: {
      coverImageFile: Express.Multer.File[] | null;
      ebookFile: Express.Multer.File[] | null;
    } = {
      coverImageFile: null,
      ebookFile: null,
    };

    //Create pipes to validate files
    const ebookPipe = new EbookValidationPipe();
    const coverImagePipe = new CoverImageValidationPipe();

    // Validate files
    files.ebookFile = ebookPipe.transform(ebookFile);
    files.coverImageFile = coverImagePipe.transform(coverImageFile);

    return this.booksService.update(bookId, bookData, files.ebookFile, files.coverImageFile);
  }

  //delete a book
  @Delete(':bookId')
  @ResponseMessage('Xóa sách thành công.')
  delete(@Param('bookId', ParseIntPositivePipe) bookId: number) {
    return this.booksService.delete(bookId);
  }

  // view a file
  @Get('view')
  @Roles()
  @Public()
  async downloadEbookFile(
    @Query('filename', new QueryNotNullPipe('filename')) filename: string,
    @Res() res: Response,
  ) {
    let folder = '';

    const parsedFile = parse(filename);

    if (FILE_CONSTANTS.EBOOK_EXT_FILE.includes(parsedFile.ext)) {
      folder = FILE_CONSTANTS.EBOOK_FOLDER;
    } else {
      folder = FILE_CONSTANTS.COVER_IMAGES_FOLDER;
    }

    const filePath = join(process.cwd(), folder, filename);

    if (!fs.existsSync(filePath)) throw new NotFoundException(`Not found file name ${filename}`);
    console.log(filePath);
    return res.sendFile(filePath);
  }

  @Get('search')
  @Roles()
  @Public()
  async searchBooks(@Query('query', new QueryNotNullPipe('query')) query: string) {
    return plainToInstance(BookInfoDto, await this.booksService.searchBooksByTitleOrAuthor(query));
  }

  @Get('search/:id')
  @Roles()
  @Public()
  searchBookById(@Param('id', ParseIntPositivePipe) bookId: number) {
    return plainToInstance(BookInfoDto, this.booksService.findById(bookId));
  }

  @Get('filter')
  @Roles()
  @Public()
  filterBooks(@Query() query: SearchBookDto) {
    return plainToInstance(BookInfoDto, this.booksService.filterBooks(query));
  }

  @ResponseMessage('Tạo tiến độ đọc sách thành công.')
  @Post('reading-progress')
  @Roles()
  async createReadingProgress(@Req() req: Request, @Body() body: CreateReadingProgressDto) {
    return await this.booksService.createReadingProgress((req?.user as User).id, body);
  }

  @ResponseMessage('Cập nhật tiến độ đọc sách thành công.')
  @Roles()
  @Patch('reading-progress')
  async updateReadingProgress(@Req() req: Request, @Body() body: UpdateReadingProgressDto) {
    console.log('Hello');

    return await this.booksService.updateReadingProgress((req?.user as User).id, body);
  }

  @ResponseMessage('Lấy tiến độ đọc sách thành công.')
  @Roles()
  @Get('reading-progress')
  async getReadingProgressByUserIdAndBookId(
    @Req() req: Request,
    @Query('bookId', ParseIntPositivePipe) bookId: number,
  ) {
    return await this.booksService.getReadingProgressByUserIdAndBookId(
      (req?.user as User).id,
      bookId,
    );
  }
}
