import { CreateUserDto } from '../dto/create-user.dto';
import { UserModel } from '../models/user.model';

export interface IUserRepository {
  createUser(createUserDto: CreateUserDto): Promise<UserModel>;
  getUsers(): Promise<UserModel[]>;
  findById(id: number): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  findByEmailWithPassword(email: string): Promise<UserModel | null>;
}
