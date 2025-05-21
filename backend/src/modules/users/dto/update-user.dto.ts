import { PartialType, PickType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';

export default class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['email', 'name', 'phoneNumber', 'birthDate']),
) {}
