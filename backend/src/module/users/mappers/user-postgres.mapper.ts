import { User } from '../entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserPostgresMapper {
  static toModel(user: User): UserModel {
    return {
      id: user.id.toString(),
      usuario: user.usuario,
      email: user.email,
      password: user.password,
    };
  }

  static toEntity(model: UserModel): User {
    const user = new User();
    user.id = Number(model.id);
    user.usuario = model.usuario;
    user.email = model.email;
    user.password = model.password;
    return user;
  }
}

