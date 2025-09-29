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

const estadisticasRepositoryProvider = {
  provide: 'IEstadisticasRepository',
  useClass: process.env.DB_TYPE === 'mongo'
    ? EstadisticasMongoRepository
    : EstadisticasPostgresRepository,
};

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ...(process.env.DB_TYPE !== 'mongo' ? [TypeOrmModule.forFeature([Imc])] : []),
    ...(process.env.DB_TYPE === 'mongo'
      ? [MongooseModule.forFeature([{ name: ImcMongo.name, schema: ImcSchema }])]
      : []),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService, estadisticasRepositoryProvider],
  exports: [EstadisticasService],
})
export class EstadisticasModule { }

