import { Injectable } from '@nestjs/common'
import { UserRepository } from './repositories/user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto)
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.getUsers()
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findByEmailWithPassword(email)
  }
}

