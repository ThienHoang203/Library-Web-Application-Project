import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import PaginateDto from 'src/common/dto/paginate.dto';
import { RatingSortType } from 'src/entities/rating.entity';

export class SearchRatingDto extends PaginateDto {
  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên' })
  @Type(() => Number)
  @IsOptional()
  bookId?: number;

  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên' })
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @Max(5, { message: 'không được lớn hơn 5' })
  @Min(1, { message: 'Rating không được bé hơn 1' })
  @IsInt({ message: 'phải là số nguyên' })
  @Type(() => Number)
  @IsOptional()
  rating?: number;

  @IsEnum(RatingSortType, {
    message: `sortBy phải là ${Object.values(RatingSortType).join(' hoặc ')}.`,
  })
  sortBy: RatingSortType = RatingSortType.CREATED_AT;
}
