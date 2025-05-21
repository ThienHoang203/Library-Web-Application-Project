import { PickType } from '@nestjs/mapped-types';
import CreateUserDto from 'src/modules/users/dto/create-user.dto';

export default class RetryPasswordDto extends PickType(CreateUserDto, ['email']) {}
