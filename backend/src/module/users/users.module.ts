import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserMongo, UserSchema } from './schemas/user.schema';
import { UserMongoRepository } from './repositories/user-mongo.repository';
import { UserPostgresRepository } from './repositories/user-postgres.repository';

import * as dotenv from 'dotenv';
dotenv.config();

const DB_TYPE = process.env.DB_TYPE;

@Module({
  imports: [
    ...(DB_TYPE === 'mongo'
      ? [MongooseModule.forFeature([{ name: UserMongo.name, schema: UserSchema }])]
      : [TypeOrmModule.forFeature([User])]
    ),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: DB_TYPE === 'mongo' ? UserMongoRepository : UserPostgresRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule { }

