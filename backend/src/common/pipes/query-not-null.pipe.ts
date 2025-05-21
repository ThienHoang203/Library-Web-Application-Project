import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryNotNullPipe implements PipeTransform {
  constructor(private readonly paramName: string) {}

  transform(value: any): any {
    if (value === null || value === undefined) {
      throw new BadRequestException(
        `Query parameter '${this.paramName}' không được phép là null hoặc undefined.`,
      );
    }
    return value;
  }
}
