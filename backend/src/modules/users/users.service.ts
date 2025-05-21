import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole, UserStatus } from 'src/entities/user.entity';
import { Equal, Like, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import AdminUpdateUserDto from './dto/admin-update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async existUser(userId: number) {
    console.log({ userId });

    const result = await this.userRepository.existsBy({ id: userId });
    if (!result) throw new NotFoundException(`Không tồn tại user với ID: ${userId}`);
  }

  async create(signupData: CreateUserDto): Promise<{ username: string; email: string }> {
    //Check if the email or phone number or username has already existed
    let user: User | null = await this.userRepository.findOneBy([
      { email: signupData.email ?? '' },
      { phoneNumber: signupData.phoneNumber ?? '' },
      { username: signupData.username },
    ]);

    if (user) {
      if (signupData.username === user.username) {
        throw new ConflictException(`Người dùng: ${signupData.username} đã tồn tại`);
      } else if (signupData.email === user.email) {
        throw new ConflictException(`Email: ${signupData.email} đã tồn tại`);
      } else if (signupData.phoneNumber === user.phoneNumber) {
        throw new ConflictException(`Số điện thoại: ${signupData.phoneNumber} đã tồn tại`);
      }
    }

    //If those fields have not in any record, it will create a new user
    user = this.userRepository.create(signupData);
    user.password = this.hashPass(signupData.password);
    const result = await this.userRepository.insert(user);

    if (result.identifiers.length < 1)
      throw new InternalServerErrorException('Tạo mới user không thành công!');

    return {
      username: user.username,
      email: user.email,
    };
  }

  async createAdmin(userData: CreateUserDto): Promise<{ username: string; email: string }> {
    const result = await this.create(userData);
    const disabledUserInfo = await this.userRepository.update(
      { username: result.username },
      { status: UserStatus.DISABLE, role: UserRole.ADMIN },
    );

    if (disabledUserInfo.affected !== 1)
      throw new InternalServerErrorException('Tạo mới admin không thành công!');

    return result;
  }

  async filterUsers({
    currentPage,
    limit,
    sortBy,
    sortOrder,
    username,
    email,
    phoneNumber,
    name,
    birthDate,
    role,
    status,
    membershipLevel,
  }: FilterUserDto): Promise<User[]> {
    let where: any = {};
    if (username) where.username = Like(`%${username}%`);
    if (email) where.email = Like(`%${email}%`);
    if (phoneNumber) where.phoneNumber = Like(`%${phoneNumber}%`);
    if (name) where.name = Like(`%${name}%`);
    if (birthDate) where.birthDate = birthDate;
    if (role) where.role = role;
    if (status) where.status = status;
    if (membershipLevel) where.membershipLevel = membershipLevel;

    const users = await this.userRepository.find({
      where,
      order: { [sortBy]: sortOrder },
      take: limit,
      skip: currentPage && limit ? (currentPage - 1) * limit : undefined,
    });

    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`Người dùng(ID: ${id}) không tồn tại`);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) throw new NotFoundException(`Người dùng(username: ${username}) không tồn tại`);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new NotFoundException(`Người dùng(email: ${email}) không tồn tại`);

    return user;
  }

  async updatePassword(user: User, oldPass: string, newPass: string) {
    if (!bcrypt.compareSync(oldPass, user.password))
      throw new BadRequestException('Mật khẩu cũ không đúng!');

    const hashedPass = this.hashPass(newPass);
    const { affected } = await this.userRepository.update(user.id, { password: hashedPass });

    if (affected !== 1) throw new InternalServerErrorException('Server bị lỗi, vui lòng thử lại!');
  }

  async updateMyAccount(id: number, updateUserDto: UpdateUserDto) {
    let isExisting: boolean = false;

    if (updateUserDto?.email) {
      isExisting = await this.userRepository.exists({
        where: { email: updateUserDto.email, id: Not(Equal(id)) },
      });

      if (isExisting) throw new ConflictException(`email: ${updateUserDto.email} đã tồn tại!`);
    }

    if (updateUserDto?.phoneNumber) {
      isExisting = await this.userRepository.exists({
        where: { phoneNumber: Equal(updateUserDto.phoneNumber), id: Not(id) },
      });

      if (isExisting)
        throw new ConflictException(`số điện thoại: ${updateUserDto.phoneNumber} đã tồn tại!`);
    }

    const result = await this.userRepository.update({ id: id }, updateUserDto);

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException(`Cập nhật user(ID: ${id}) không thành công!`);
  }

  async update(id: number, updateData: AdminUpdateUserDto) {
    let isExisting: boolean = await this.userRepository.existsBy({ id });
    if (!isExisting) throw new NotFoundException(`Không tồn tại user với ID: ${id}`);

    if (updateData?.email) {
      isExisting = await this.userRepository.exists({
        where: { email: updateData.email, id: Not(Equal(id)) },
      });

      if (isExisting) throw new ConflictException(`email: ${updateData.email} đã tồn tại!`);
    }

    if (updateData?.phoneNumber) {
      isExisting = await this.userRepository.exists({
        where: { phoneNumber: Equal(updateData.phoneNumber), id: Not(id) },
      });

      if (isExisting)
        throw new ConflictException(`số điện thoại: ${updateData.phoneNumber} đã tồn tại!`);
    }

    const result = await this.userRepository.update({ id: id }, updateData);

    if (!result.affected || result.affected < 1)
      throw new InternalServerErrorException(`Cập nhật user(ID: ${id}) không thành công!`);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async resetNewPassword(email: string, newPlainPassword: string): Promise<{ userId: number }> {
    const user = await this.findByEmail(email);

    if (user.status === UserStatus.DISABLE)
      throw new ForbiddenException(`Người dùng(email =${email}) không được phép cập nhật`);

    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    this.userRepository.update({ email }, { password: hashedPassword });

    return { userId: user.id };
  }

  async disableUser(id: number): Promise<void> {
    const hasUserId = await this.userRepository.existsBy({ id, status: UserStatus.ACTIVE });
    if (!hasUserId) throw new NotFoundException(`userId: ${id} không tồn tại, hoặc đã disable!`);

    const result = await this.userRepository.update({ id }, { status: UserStatus.DISABLE });

    if (result.affected !== 1)
      throw new InternalServerErrorException(`Khóa user(ID: ${id}) thất bại`);
  }

  async delete(id: number): Promise<void> {
    const user: boolean = await this.userRepository.existsBy({ id });

    if (!user) throw new NotFoundException(`Người dùng(ID: ${id}) không tồn tại!`);

    const result = await this.userRepository.delete({ id: id });

    if (result.affected !== 1) throw new InternalServerErrorException('Xóa không thành công!');
  }

  hashPass(plainPass: string): string {
    return bcrypt.hashSync(plainPass, 10);
  }
}
