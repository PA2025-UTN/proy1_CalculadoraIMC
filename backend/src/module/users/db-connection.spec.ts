import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users.module';
import { ImcModule } from '../imc/imc.module';
import * as dotenv from 'dotenv';
dotenv.config();

jest.setTimeout(20000);
describe('Conexión a base de datos', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: process.env.DB_TYPE as "mysql" | "postgres",
          host: process.env.DB_TYPE === 'postgres' ? process.env.PG_HOST : process.env.MYSQL_HOST,
          port: process.env.DB_TYPE === 'postgres' ? parseInt(process.env.PG_PORT || '5432', 10) : parseInt(process.env.MYSQL_PORT || '3306', 10),
          username: process.env.DB_TYPE === 'postgres' ? process.env.PG_USERNAME : process.env.MYSQL_USERNAME,
          password: process.env.DB_TYPE === 'postgres' ? process.env.PG_PASSWORD : process.env.MYSQL_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
          ssl: process.env.DB_TYPE === 'postgres' ? { rejectUnauthorized: false } : undefined
        }),
        UsersModule,
        ImcModule
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
  });

  it('Debería conectar a la base de datos', async () => {
    expect(dataSource.isInitialized).toBe(true);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
  
});
