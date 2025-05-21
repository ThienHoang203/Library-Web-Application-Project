import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { SortOrder } from '../utils/type';

export default abstract class PaginateDto {
  @IsOptional()
  sortBy: unknown;

  @IsEnum(SortOrder, { message: `sortOrder phải là ${Object.values(SortOrder).join(' hoặc ')}.` })
  @IsOptional()
  sortOrder: SortOrder = SortOrder.DESC;

  @Min(1, { message: 'Phải lớn hơn 1!' })
  @IsInt({ message: 'Phải là số nguyên' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Không được để trống!' })
  @IsOptional()
  currentPage?: number;

  @Min(1, { message: 'Phải lớn hơn 1!' })
  @IsInt({ message: 'Phải là số nguyên' })
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
