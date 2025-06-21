import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from 'src/entities/user.entity';
import { hashPass } from 'src/common/utils/functions';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    // insert default users
    console.log('Seeding default users...');
    const repository = dataSource.getRepository(User);

    const adminExists = await repository.existsBy({
      username: 'admin',
      email: 'admin@admin.com',
      phoneNumber: '0000000000',
    });
    if (!adminExists) {
      const result = await repository.insert([
        {
          email: 'admin@admin.com',
          //password has atleast 8 characters
          password: await hashPass('admin123'),
          phoneNumber: '0000000000',
          username: 'admin',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          name: 'Admin User',
          birthDate: new Date('1990-01-01'),
        },
      ]);

      if (result.identifiers.length < 1) {
        console.log('Failed to insert admin user');
      } else {
        console.log('Admin user inserted successfully');
      }
    }

    const userExists = await repository.existsBy({
      username: 'user',
      email: 'user@user.com',
      phoneNumber: '0000000001',
    });
    if (!userExists) {
      const result = await repository.insert([
        {
          email: 'user@user.com',
          //password has atleast 8 characters
          password: await hashPass('user1234'),
          phoneNumber: '0000000001',
          username: 'user',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          name: 'Normal User',
          birthDate: new Date('2000-01-01'),
        },
      ]);

      if (result.identifiers.length < 1) {
        console.log('Failed to insert normal user');
      } else {
        console.log('Normal user inserted successfully');
      }
    }
  }
}
