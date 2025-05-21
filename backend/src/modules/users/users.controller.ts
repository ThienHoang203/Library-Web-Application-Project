import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { ParseIntPositivePipe } from 'src/common/pipes/parse-int-positive.pipe';
import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User, UserRole } from 'src/entities/user.entity';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import UpdatePasswordUserDto from './dto/update-password-user.dto';
import AdminUpdateUserDto from './dto/admin-update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get('filter')
  async filterUsers(@Body() filterParams: FilterUserDto) {
    const users = await this.usersService.filterUsers(filterParams);
    return instanceToPlain(users);
  }

  @Roles(UserRole.ADMIN)
  @Get('filter/:id')
  async filterUserById(
    @Param('id', ParseIntPositivePipe)
    id: number,
  ) {
    const user = await this.usersService.findById(id);
    return instanceToPlain(user);
  }

  @Get('profile')
  async findMyAccount(@Req() req: Request) {
    return instanceToPlain(req.user);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cập nhật mật khẩu thành công.')
  updateMyPassword(@Req() req: Request, @Body() userData: UpdatePasswordUserDto) {
    const payload = req.user as User;

    return this.usersService.updatePassword(payload, userData.oldPassword, userData.newPassword);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Thông tin của bạn đã được cập nhật thành công.')
  updateMyInformation(@Req() req: Request, @Body() userData: UpdateUserDto) {
    return this.usersService.updateMyAccount((req?.user as User).id, userData);
  }

  //For admin to update user's information
  @Roles(UserRole.ADMIN)
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cập nhật thông tin người dùng thành công.')
  updateUserInformation(
    @Query('id', ParseIntPositivePipe) id: number,
    @Body() updateData: AdminUpdateUserDto,
  ) {
    return this.usersService.update(id, updateData);
  }

  // users can disable their account, but cannot delete
  @Patch('disable')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tài khoản của bạn đã được khóa.')
  disableMyAccount(@Req() req: Request) {
    return this.usersService.disableUser((req.user as User).id);
  }

  @Patch('disable/:userId')
  @ResponseMessage('Tài khoản đã được khóa.')
  @Roles(UserRole.ADMIN)
  disableUser(@Param('userId', ParseIntPositivePipe) userId: number) {
    return this.usersService.disableUser(userId);
  }

  // delete a user
  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Xóa user thành công.')
  deleteOne(@Param('userId', ParseIntPositivePipe) userId: number) {
    return this.usersService.delete(userId);
  }
}
