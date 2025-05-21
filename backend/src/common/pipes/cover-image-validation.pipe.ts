import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FILE_CONSTANTS } from '../utils/constants';

@Injectable()
export class CoverImageValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[] | null | undefined) {
    if (!files || files.length === 0) {
      return null;
    }

    for (const file of files) {
      if (!FILE_CONSTANTS.COVER_IMAGE_MIME_TYPE.includes(file.mimetype)) {
        throw new BadRequestException('File ảnh bìa chỉ chấp nhận file JPEG, JPG, hoặc PNG');
      }

      if (file.size > FILE_CONSTANTS.MAX_FILE_COVER_IMAGE_SIZE) {
        throw new BadRequestException('Kích thước file ảnh bìa không được vượt quá 5MB');
      }
    }
    return files;
  }
}
