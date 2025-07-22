import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdateReadingProgressDto {
  @IsInt({ message: 'bookId must be an integer' })
  @Min(1, { message: 'bookId must be at least 1' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'lastPage cannot be empty' })
  lastPage: number;

  @IsInt({ message: 'bookId must be an integer' })
  @Min(0, { message: 'bookId must be at least 1' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'bookId cannot be empty' })
  bookId: number;

  @IsInt({ message: 'bookId must be an integer' })
  @Min(0, { message: 'bookId must be at least 1' })
  @Type(() => Number)
  @IsOptional({ message: 'lastOffset is optional' })
  lastOffset?: number;
}
