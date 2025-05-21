import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User, UserStatus } from 'src/entities/user.entity';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class UserStatusInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: Request = context.switchToHttp().getRequest();

    const payload = request?.user;
    if (!payload) {
      if (isPublic) return next.handle();
      else throw new UnauthorizedException('Bạn chưa đăng nhập!');
    }

    if ((payload as User).status === UserStatus.DISABLE)
      throw new ForbiddenException('Tài khoản của bạn không hoạt động');

    return next.handle();
  }
}
