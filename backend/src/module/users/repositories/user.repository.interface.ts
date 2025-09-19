import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto'

export interface IUserRepository {
  createUser(createUserDto: CreateUserDto): Promise<User>
  getUsers(): Promise<User[]>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByEmailWithPassword(email: string): Promise<User | null>
}

