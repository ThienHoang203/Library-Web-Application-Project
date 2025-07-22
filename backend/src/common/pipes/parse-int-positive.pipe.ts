import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseIntPositivePipe implements PipeTransform {
  transform(value: any, metadata?: ArgumentMetadata) {
    if (value === undefined || value === null) {
      throw new BadRequestException('Không được để trống!');
    }
    const intValue = parseInt(value, 10);

    if (isNaN(intValue)) {
      console.log('Heelo');

      throw new BadRequestException('Tham số phải là kiểu nguyên!');
    }

    if (intValue < 0) {
      throw new BadRequestException('Tham số không được nhỏ hơn 0!');
    }

    return intValue;
  }
}
