import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';

@Module({
  controllers: [HistorialController],
  providers: [HistorialService],
})
export class HistorialModule {}
