import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import PaginateDto from 'src/common/dto/paginate.dto';

export class UserSearchRatingDto extends PaginateDto {
  @Min(0, { message: 'Số lượng sách không được bé hơn 0' })
  @IsInt({ message: 'phải là số nguyên' })
  @Type(() => Number)
  bookId: number;

  @Max(5, { message: 'không được lớn hơn 5' })
  @Min(1, { message: 'Rating không được bé hơn 1' })
  @IsInt({ message: 'phải là số nguyên' })
  @Type(() => Number)
  rating: number;

  sortBy: 'rating';
}
