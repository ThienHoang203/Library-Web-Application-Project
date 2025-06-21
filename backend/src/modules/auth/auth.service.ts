import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import LogInDto from './dto/log-in.dto';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from '../users/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import ForgotPassword from 'src/entities/forgot-password.entity';
import { Repository } from 'typeorm';
import { comparePlainAndHash, generateRandomCode, hashCode } from 'src/common/utils/functions';
import { formatVietnamDateTime } from 'src/common/utils/fotmat';
import ResetPasswordDto from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepository: Repository<ForgotPassword>,
  ) {}

  async validateUser({ password, username }: LogInDto): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (await comparePlainAndHash(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Xác thực thất bại!');
  }

  async logIn(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async signUp(signupData: CreateUserDto) {
    const result = await this.usersService.create(signupData);
    this.sendSignupEmail(result.email, result.username);
    return result;
  }

  async signupAdmin(signupData: CreateUserDto): Promise<any> {
    const result = await this.usersService.createAdmin(signupData);
    this.sendSignupEmail(result.email, result.username);
    return result;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    const verificationCode = generateRandomCode(6);
    const hashedVerifycationCode = await hashCode(verificationCode);

    const expiresIn = new Date(Date.now() + 5 * 60 * 1000); //code is going to expire after 5 minutes

    const result1 = await this.forgotPasswordRepository.update(
      { email: user.email },
      { verificationCode: hashedVerifycationCode, expiresIn },
    );

    if (result1.affected === 0) {
      const result2 = await this.forgotPasswordRepository.insert({
        verificationCode: hashedVerifycationCode,
        email: user.email,
        user,
        expiresIn,
      });

      if (result2.identifiers.length === 0 || !result2.identifiers[0]?.id)
        throw new InternalServerErrorException('Tạo mã khôi phục thất bại!');
    }

    this.sendResetPasswordEmail(user.email, verificationCode, formatVietnamDateTime(expiresIn));
  }

  async resetPassword({ email, newPassword, verifycationCode }: ResetPasswordDto): Promise<void> {
    const forgotPassword = await this.forgotPasswordRepository.findOneBy({ email });
    if (!forgotPassword) throw new NotFoundException(`Không tìm thấy email ${email}`);

    const compare = await comparePlainAndHash(verifycationCode, forgotPassword.verificationCode);
    if (!compare) throw new BadRequestException(`Mã xác thực không đúng!`);

    if (forgotPassword.expiresIn.getTime() < Date.now())
      throw new BadRequestException('Mã kích hoạt đã hết hạn!');

    await this.usersService.resetNewPassword(email, newPassword);

    this.forgotPasswordRepository.delete({ email: email });
  }

  sendResetPasswordEmail(email: string, verificationCode: string, expiresIn: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Activate Code Reset Password',
      template: 'forgot-password',
      context: {
        name: email,
        verificationCode,
        expiresIn,
        resetPassURL: `http://book-management.vn/recover-password?email=${email}&verfiycationCode=${verificationCode}`,
      },
      from: 'Book.management@work.com',
    });
  }

  sendSignupEmail(email: string, username?: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Sign-up your account',
      template: 'register',
      context: {
        name: username ?? email,
      },
      from: 'Book.management@work.com',
    });
  }
}
