import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasRepository } from './repositories/estadisticas.repository';
import { Imc } from '../imc/entities/imc.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Imc]),
    AuthModule,
    UsersModule
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService, EstadisticasRepository],
})
export class EstadisticasModule {}
