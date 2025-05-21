import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { IsValidBirthDate } from 'src/common/decorators/is-valid-birthdate.decorator';
import PaginateDto from 'src/common/dto/paginate.dto';
import { UserMembershipLevel, UserRole, UserSortType, UserStatus } from 'src/entities/user.entity';

export class FilterUserDto extends PaginateDto {
  @IsString({ message: 'Phải là chuỗi!' })
  @IsOptional()
  username: string;

  @IsEmail({}, { message: 'Phải là định dạng email!' })
  @IsString({ message: 'Phải là chuỗi!' })
  @IsOptional()
  email: string;

  @IsPhoneNumber('VN', { message: 'Phải là định dạng số điện thoại di động!' })
  @IsString({ message: 'Phải là chuỗi!' })
  @IsOptional()
  phoneNumber: string;

  @IsString({ message: 'Phải là chuỗi!' })
  @IsOptional()
  name: string;

  @IsValidBirthDate()
  @IsOptional()
  birthDate: Date;

  @IsEnum(UserRole, { message: `Phải là ${Object.values(UserRole).join(' hoặc ')}!` })
  @IsOptional()
  role: UserRole;

  @IsEnum(UserStatus, { message: `Phải là ${Object.values(UserStatus).join(' hoặc ')}!` })
  @IsOptional()
  status: UserStatus;

  @IsEnum(UserMembershipLevel, {
    message: `Phải là ${Object.values(UserMembershipLevel).join(' hoặc ')}!`,
  })
  @IsOptional()
  membershipLevel: UserMembershipLevel;

  @IsEnum(UserSortType, {
    message: `sortBy phải là ${Object.values(UserSortType).join(' hoặc ')}.`,
  })
  sortBy: UserSortType = UserSortType.USERNAME;
}
