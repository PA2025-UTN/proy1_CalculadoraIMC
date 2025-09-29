import { UserModel } from 'src/module/users/models/user.model';
import { User } from 'src/module/users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User | UserModel;
  }
}

