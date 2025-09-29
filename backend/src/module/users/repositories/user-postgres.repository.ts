import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from './user.repository.interface';
import { UserModel } from '../models/user.model';
import { UserPostgresMapper } from '../mappers/user-postgres.mapper';

@Injectable()
export class UserPostgresRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const saved = await this.repository.save(createUserDto);
    return UserPostgresMapper.toModel(saved);
  }

  async getUsers(): Promise<UserModel[]> {
    const users = await this.repository.find();
    return users.map(u => UserPostgresMapper.toModel(u));
  }

  async findById(id: number): Promise<UserModel | null> {
    const user = await this.repository.findOne({ where: { id: id } });
    return user ? UserPostgresMapper.toModel(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.repository.findOneBy({ email });
    return user ? UserPostgresMapper.toModel(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<UserModel | null> {
    const user = await this.repository.findOne({
      where: { email },
      select: ['id', 'usuario', 'email', 'password'],
    });
    return user ? UserPostgresMapper.toModel(user) : null;
  }

}

