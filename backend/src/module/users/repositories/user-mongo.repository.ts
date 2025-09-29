import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMongo } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from './user.repository.interface';
import { UserModel } from '../models/user.model';
import { UserMongoMapper } from '../mappers/user-mongo.mapper';

@Injectable()
export class UserMongoRepository implements IUserRepository {
  constructor(
    @InjectModel(UserMongo.name) private readonly userModel: Model<UserMongo>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const user = new this.userModel(createUserDto);
    const saved = await user.save();
    return UserMongoMapper.toModel(saved);
  }

  async getUsers(): Promise<UserModel[]> {
    const users = await this.userModel.find().exec();
    return users.map(u => UserMongoMapper.toModel(u));
  }

  async findById(id: string): Promise<UserModel | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? UserMongoMapper.toModel(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? UserMongoMapper.toModel(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<UserModel | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('_id usuario email password')
      .exec();
    return user ? UserMongoMapper.toModel(user) : null;
  }
}

