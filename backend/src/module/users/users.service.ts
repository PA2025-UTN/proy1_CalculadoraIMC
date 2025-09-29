import { Injectable } from '@nestjs/common'
import { UserRepository } from './repositories/user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly respository: UserRepository) { }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.respository.createUser(createUserDto)
  }

  getUsers(): Promise<User[]> {
    return this.respository.getUsers()
  }

  findById(id: number): Promise<User | null> {
    return this.respository.findById(id)
  }

  findByEmail(email: string): Promise<User | null> {
    return this.respository.findByEmail(email)
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.respository.findByEmailWithPassword(email)
  }
}

