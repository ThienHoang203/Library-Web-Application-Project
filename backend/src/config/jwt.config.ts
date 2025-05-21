import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET_KEY') ?? 'default_secret',
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE_TIME') ?? '1h',
      },
    };
  }
}
