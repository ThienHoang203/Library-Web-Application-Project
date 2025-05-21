import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsValidBirthDate } from 'src/common/decorators/is-valid-birthdate.decorator';
import { UserMembershipLevel, UserRole, UserStatus } from 'src/entities/user.entity';

export default class AdminUpdateUserDto {
  @MaxLength(50, { message: 'tên đăng nhập không được vượt quá 50 kí tự' })
  @IsString({ message: 'tên đăng nhập phải là chuỗi' })
  @IsOptional()
  username: string;

  @MinLength(8, { message: 'mật khẩu đăng nhập không được ít hơn 8 kí tự' })
  @IsString({ message: 'mật khẩu đăng nhập phải là chuỗi' })
  @IsOptional()
  password: string;

  @MaxLength(200, { message: 'địa chỉ email không được vượt quá 200 kí tự' })
  @IsEmail({}, { message: 'địa chỉ email không đúng định dạng' })
  @IsString({ message: 'email phải là chuỗi' })
  @IsOptional()
  email: string;

  @IsPhoneNumber('VN', { message: 'số điện thoại không đúng định dạng' })
  @MaxLength(10, { message: 'số điện thoại không được vượt quá 10 chữ số' })
  @IsString({ message: 'số điện thoại phải là chuỗi' })
  @IsOptional()
  phoneNumber: string;

  @IsValidBirthDate()
  @IsOptional()
  birthDate: Date;

  @MaxLength(50, { message: 'tên người dùng không được vượt quá 50 kí tự' })
  @IsString({ message: 'tên người dùng phải là chuỗi' })
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEnum(UserRole, { message: `Phải là ${Object.values(UserRole).join(' hoặc ')}!` })
  @IsOptional()
  role: UserRole;

  @IsEnum(UserMembershipLevel, {
    message: `Phải là ${Object.values(UserMembershipLevel).join(' hoặc ')}!`,
  })
  @IsOptional()
  membershipLevel: UserMembershipLevel;

  @IsEnum(UserStatus, {
    message: `Phải là ${Object.values(UserStatus).join(' hoặc ')}!`,
  })
  @IsOptional()
  status: UserStatus;
}
