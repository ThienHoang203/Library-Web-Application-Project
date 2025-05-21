import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/common/passports/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/config/jwt.config';
import ForgotPassword from 'src/entities/forgot-password.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
    TypeOrmModule.forFeature([ForgotPassword]),
    UsersModule,
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
