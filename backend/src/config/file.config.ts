import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configservice: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      dest: this.configservice.get<string>('UPLOAD_FOLDER'),
    };
  }
}
