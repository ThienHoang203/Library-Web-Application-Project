import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { createFolderIfAbsent } from './common/utils/functions';
import { FILE_CONSTANTS } from './common/utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = configuration().port;
  app.enableCors();
  app.setGlobalPrefix('api', { exclude: [''] });
  createFolderIfAbsent(FILE_CONSTANTS.UPLOAD_DIR);
  createFolderIfAbsent(FILE_CONSTANTS.EBOOK_FOLDER);
  createFolderIfAbsent(FILE_CONSTANTS.COVER_IMAGES_FOLDER);
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
