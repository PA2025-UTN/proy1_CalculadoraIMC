import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ImcModule } from './module/imc/imc.module';
import { AppController } from './app.controller';


@Module({
  imports: [ImcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}