import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Request } from 'express';
import { User, UserRole } from 'src/entities/user.entity';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ParseIntPositivePipe } from 'src/common/pipes/parse-int-positive.pipe';
import { UserSearchRatingDto } from './dto/user-search-rating.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SearchRatingDto } from './dto/search-rating.dto';
import { Public } from 'src/common/decorators/public-route.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ResponseMessage('Tạo đánh giá thành công.')
  create(@Req() req: Request, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create((req?.user as User).id, createRatingDto);
  }

  @Patch('update')
  @ResponseMessage('Cập nhật thành công')
  async update(
    @Req() req: Request,
    @Query('ratingId', ParseIntPositivePipe) ratingId: number,
    @Body() body: UpdateRatingDto,
  ) {
    return this.ratingsService.update((req?.user as User).id, ratingId, body);
  }

  @Delete('delete')
  @ResponseMessage('Xóa thành công')
  async remove(@Req() req: Request, @Query('ratingId', ParseIntPositivePipe) ratingId: number) {
    const user = req.user as User;
    let userId: number | undefined = undefined;
    if (user.role !== UserRole.ADMIN) {
      userId = user.id;
    }
    return this.ratingsService.remove(ratingId, userId);
  }

  @Get('my-search')
  async searchMyRatings(@Req() req: Request, @Query() query: UserSearchRatingDto) {
    return this.ratingsService.searchMyRatings((req.user as User).id, query);
  }

  @Get('my-search/:ratingId')
  async getMyRatingByRatingId(
    @Req() req: Request,
    @Param('ratingId', ParseIntPositivePipe) ratingId: number,
  ) {
    return this.ratingsService.findByRatingIdWithUserId(ratingId, (req.user as User).id);
  }

  @Roles(UserRole.ADMIN)
  @Get('filter')
  async filterRatings(@Query() query: SearchRatingDto) {
    return this.ratingsService.filterRatings(query);
  }

  @Roles(UserRole.ADMIN)
  @Get('search/:ratingId')
  async searchRatingById(@Param('ratingId', ParseIntPositivePipe) ratingId: number) {
    return this.ratingsService.findByRatingId(ratingId);
  }

  @Public()
  @Get(':bookId')
  async getBookRating(@Param('bookId', ParseIntPositivePipe) bookId: number) {
    const searchData = new SearchRatingDto();
    searchData.bookId = bookId;

    return this.ratingsService.filterRatings(searchData);
  }
}
