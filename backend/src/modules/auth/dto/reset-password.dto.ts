import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @MaxLength(200, { message: 'địa chỉ email không được vượt quá 200 kí tự' })
  @IsEmail({}, { message: 'địa chỉ email không đúng định dạng' })
  @IsString({ message: 'email phải là chuỗi' })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @MaxLength(6, { message: 'Mã xác thực không đúng định dạng' })
  @IsString({ message: 'Mã xác thực phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  verifycationCode: string;

  @MinLength(8, { message: 'mật khẩu đăng nhập không được ít hơn 8 kí tự' })
  @IsString({ message: 'mật khẩu đăng nhập phải là chuỗi' })
  @IsNotEmpty({ message: 'mật khẩu đăng nhập không được để trống' })
  newPassword: string;
}
