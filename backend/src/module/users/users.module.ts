import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserMongo, UserSchema } from './schemas/user.schema';
import { UserMongoRepository } from './repositories/user-mongo.repository';
import { UserPostgresRepository } from './repositories/user-postgres.repository';

const userRepositoryProvider = {
  provide: 'IUserRepository',
  useClass: process.env.DB_TYPE === 'mongo' ? UserMongoRepository : UserPostgresRepository,
};

@Module({
  imports: [
    ...(process.env.DB_TYPE !== 'mongo' ? [TypeOrmModule.forFeature([User])] : []),
    ...(process.env.DB_TYPE === 'mongo'
      ? [MongooseModule.forFeature([{ name: UserMongo.name, schema: UserSchema }])]
      : []),
  ],
  controllers: [UsersController],
  providers: [UsersService, userRepositoryProvider],
  exports: [UsersService],
})
export class UsersModule { }

