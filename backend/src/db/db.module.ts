import { Module } from '@nestjs/common';
import { dataSourceOptions } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import UserSeeder from './seeds/user.seeder';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule],
  providers: [UserSeeder],
})
export class DbModule {}
