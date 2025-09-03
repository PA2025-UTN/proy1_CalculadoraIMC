import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';

@Module({
  controllers: [ImcController],
  providers: [ImcService],
})
export class ImcModule {}
