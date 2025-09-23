import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/module/users/users.service';
import { User } from 'src/module/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request & { user: User } = context
        .switchToHttp()
        .getRequest();
      const token = request.headers.authorization;

      if (token == null) {
        throw new UnauthorizedException('Token no enviado');
      }

      const payload = this.authService.getPayload(token);
      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
}
