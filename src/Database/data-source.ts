import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  dropSchema: false,
  logging: false,
};

console.log("Configuring", process.env.DB_HOST, "database connection");
console.log("Configuring data source with options: ", dataSourceOptions);

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
