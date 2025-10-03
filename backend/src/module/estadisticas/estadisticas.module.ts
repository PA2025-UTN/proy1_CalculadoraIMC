import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { Imc } from '../imc/entities/imc.entity';
import { ImcMongo, ImcSchema } from '../imc/schemas/imc.schema';
import { EstadisticasPostgresRepository } from './repositories/estadisticas-postgres.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { EstadisticasMongoRepository } from './repositories/estadisticas-mongo.repository';

import * as dotenv from 'dotenv';
dotenv.config();

const DB_TYPE = process.env.DB_TYPE;

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ...(DB_TYPE === 'mongo'
      ? [MongooseModule.forFeature([{ name: ImcMongo.name, schema: ImcSchema }])]
      : [TypeOrmModule.forFeature([Imc])]
    ),
  ],
  controllers: [EstadisticasController],
  providers: [
    EstadisticasService,
    {
      provide: 'IEstadisticasRepository',
      useClass: DB_TYPE === 'mongo'
        ? EstadisticasMongoRepository
        : EstadisticasPostgresRepository,
    }
  ],
  exports: [EstadisticasService],
})
export class EstadisticasModule { }

