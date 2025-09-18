import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto'
import { IUserRepository } from './user.repository.interface'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepo: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.ormRepo.save(createUserDto)
  }

  async getUsers(): Promise<User[]> {
    return this.ormRepo.find()
  }

  async findById(id: number): Promise<User | null> {
    return this.ormRepo.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.ormRepo.findOneBy({ email })
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.ormRepo.findOne({
      where: { email },
      select: ['id', 'usuario', 'email', 'password'],
    })
  }
}

