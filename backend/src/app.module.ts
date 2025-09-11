import { Module } from '@nestjs/common';
import { ImcModule } from './module/imc/imc.module';

@Module({
  imports: [ImcModule],
})

export class AppModule { }
