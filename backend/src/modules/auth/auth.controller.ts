import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public-route.decorator';
import CreateUserDto from '../users/dto/create-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import RetryPasswordDto from './dto/retry-password.dto';
import ResetPasswordDto from './dto/reset-password.dto';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async logIn(@Req() req: Request) {
    return this.authService.logIn(req.user as User);
  }

  //for normal user sign-up
  @Post('signup')
  @Public()
  async signUp(@Body() signupData: CreateUserDto) {
    return this.authService.signUp(signupData);
  }

  //for admin sign-up
  @Post('signup/admin')
  @Public()
  @ResponseMessage('Tạo tài khoản admin thành công, chờ ADMIN active tài khoản!')
  async signUpAdmin(@Body() signupData: CreateUserDto) {
    return this.authService.signupAdmin(signupData);
  }

  @Post('forgot-password')
  @ResponseMessage('Gửi mã kích hoạt thành công, vui lòng kiểm tra email.')
  @Public()
  retryPassword(@Body() userData: RetryPasswordDto) {
    return this.authService.forgotPassword(userData.email);
  }

  @Post('reset-password')
  @ResponseMessage('Thay đổi mật khẩu thành công, vui lòng đăng nhập lại.')
  @Public()
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
