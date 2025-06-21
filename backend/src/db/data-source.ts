import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config();

// This is the data source configuration for the application.
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5555),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  seeds: ['dist/db/seeds/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
