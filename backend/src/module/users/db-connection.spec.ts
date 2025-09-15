// test/db-connection.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersModule } from './users.module';
import { Imc } from '../imc/entities/imc.entity';
import * as dotenv from 'dotenv';
dotenv.config();

jest.setTimeout(20000);
describe('Conexión a base de datos', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [User, Imc],
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    dataSource = module.get(DataSource);
  });

  it('Debería conectar a la base de datos', async () => {
    expect(dataSource.isInitialized).toBe(true);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });
  
});
