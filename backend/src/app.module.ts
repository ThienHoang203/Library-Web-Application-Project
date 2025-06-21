import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipeCustom } from './common/pipes/validation-custom.pipe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailFactory } from './config/mail.config';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './common/passports/jwt.strategy';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { UserStatusInterceptor } from './common/interceptors/user-status.interceptor';
import { BorrowingTransactionModule } from './modules/borrowing-transaction/borrowing-transaction.module';
import { FinesModule } from './modules/fines/fines.module';
import { BookShelfModule } from './modules/book-shelf/book-shelf.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailFactory,
    }),
    UsersModule,
    BooksModule,
    RatingsModule,
    AuthModule,
    BorrowingTransactionModule,
    FinesModule,
    BookShelfModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    { provide: APP_PIPE, useClass: ValidationPipeCustom },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // just in case the user's status is disable ,but the token of user still works, and then this is going to solve this problem, by auto check every time user query to server
    { provide: APP_INTERCEPTOR, useClass: UserStatusInterceptor },
    AppService,
  ],
})
export class AppModule {}
