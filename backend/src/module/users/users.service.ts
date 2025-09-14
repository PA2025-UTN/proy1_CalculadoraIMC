import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  createUser(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'usuario', 'email', 'password'],
    });
  }
}
