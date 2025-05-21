import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipeCustom extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => {
            return {
              [error.property]: error.constraints
                ? Object.values(error.constraints)[0]
                : 'unknown error',
            };
          }),
        );
      },
    });
  }
}
