import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imc } from './entities/imc.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Imc]),
    AuthModule,
    UsersModule
  ],
  controllers: [ImcController],
  providers: [ImcService, AuthGuard],
  exports: [ImcService]
})
export class ImcModule { }
