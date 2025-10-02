import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Imc } from './entities/imc.entity';
import { ImcMongo, ImcSchema } from './schemas/imc.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ImcPostgresRepository } from './repositories/imc-postgres.repository';
import { ImcMongoRepository } from './repositories/imc-mongo.repository';

// Load environment variables
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
  controllers: [ImcController],
  providers: [
    ImcService, 
    AuthGuard, 
    {
      provide: 'IImcRepository',
      useClass: DB_TYPE === 'mongo' ? ImcMongoRepository : ImcPostgresRepository,
    }
  ],
  exports: [ImcService],
})
export class ImcModule { }

