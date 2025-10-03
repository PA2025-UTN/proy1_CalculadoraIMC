import { Module } from '@nestjs/common';
import { ImcModule } from './module/imc/imc.module';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { EstadisticasModule } from './module/estadisticas/estadisticas.module';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

const DB_TYPE = process.env.DB_TYPE;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ...(DB_TYPE !== 'mongo'
      ? [
        TypeOrmModule.forRoot({
          type: DB_TYPE as 'mysql' | 'postgres',
          host:
            DB_TYPE === 'postgres'
              ? process.env.PG_HOST
              : process.env.MYSQL_HOST,
          port:
            DB_TYPE === 'postgres'
              ? parseInt(process.env.PG_PORT || '5432', 10)
              : parseInt(process.env.MYSQL_PORT || '3306', 10),
          username:
            DB_TYPE === 'postgres'
              ? process.env.PG_USERNAME
              : process.env.MYSQL_USERNAME,
          password:
            DB_TYPE === 'postgres'
              ? process.env.PG_PASSWORD
              : process.env.MYSQL_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: true,
          autoLoadEntities: true,
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          ssl: DB_TYPE === 'postgres' ? { rejectUnauthorized: false } : undefined,
        }),
      ]
      : []),

    ...(DB_TYPE === 'mongo'
      ? [MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/imc_db')]
      : []),

    ImcModule,
    AuthModule,
    UsersModule,
    EstadisticasModule,
  ],
})
export class AppModule { }

