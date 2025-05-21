import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'book_management2',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'custom_migration_table',
});
