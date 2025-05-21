import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FILE_CONSTANTS } from '../utils/constants';

@Injectable()
export class EbookValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[] | null | undefined) {
    if (!files || files.length === 0) {
      return null;
    }

    for (const file of files) {
      if (!FILE_CONSTANTS.EBOOK_MIME_TYPE.includes(file.mimetype)) {
        throw new BadRequestException('File ebook chỉ chấp nhận file PDF, hoặc EPUB');
      }

      if (file.size > FILE_CONSTANTS.MAX_FILE_EBOOK_SIZE) {
        throw new BadRequestException('Kích thước file ebook không được vượt quá 60MB');
      }
    }
    return files;
  }
}
