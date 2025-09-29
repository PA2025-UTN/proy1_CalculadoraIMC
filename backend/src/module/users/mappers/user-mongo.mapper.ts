import { UserModel } from '../models/user.model';
import { UserMongo } from '../schemas/user.schema';

export class UserMongoMapper {
  static toModel(user: any): UserModel {
    return {
      id: user._id.toString(),
      usuario: user.usuario,
      email: user.email,
      password: user.password,
    };
  }

  static toDocument(model: UserModel): Partial<UserMongo> {
    return {
      _id: model.id,
      usuario: model.usuario,
      email: model.email,
      password: model.password,
    };
  }
}

