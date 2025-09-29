import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from './repositories/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private readonly repository: IUserRepository,
  ) { }

  createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    return this.repository.createUser(createUserDto);
  }

  getUsers(): Promise<UserModel[]> {
    return this.repository.getUsers();
  }

  findById(id: string): Promise<UserModel | null> {
    return this.repository.findById(id);
  }

  findByEmail(email: string): Promise<UserModel | null> {
    return this.repository.findByEmail(email);
  }

  findByEmailWithPassword(email: string): Promise<UserModel | null> {
    return this.repository.findByEmailWithPassword(email);
  }
}

