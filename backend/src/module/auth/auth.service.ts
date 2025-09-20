import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { config } from 'src/common/config/JwtConfig';
import { Payload } from 'src/common/interfaces/payload';

type TokenPayload = Omit<Payload, 'iat' | 'exp'>;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  /** Registrar usuario */
  async register(body: RegisterDTO) {
    const userExists = await this.usersService.findByEmail(body.email);
    if (userExists) {
      throw new HttpException('El usuario ya existe', 400);
    }

    const hashedPassword = await hash(body.password, 10);

    return this.usersService.createUser({
      usuario: body.usuario,
      email: body.email,
      password: hashedPassword,
    });
  }

  /** Login */
  async login(body: LoginDTO) {
    const user = await this.usersService.findByEmailWithPassword(body.email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload: TokenPayload = { email: user.email };
    return {
      accessToken: this.generateToken(payload, 'auth'),
      refreshToken: this.generateToken(payload, 'refresh'),
    };
  }

  /** Genera token */
  generateToken(payload: TokenPayload, type: 'auth' | 'refresh' = 'auth'): string {
    return sign(payload, config[type].secret, {
      expiresIn: config[type].expiresIn,
    });
  }

  /** Refresh token */
  refreshToken(refreshToken: string) {
    try {
      const payload = verify(refreshToken, config.refresh.secret) as Payload;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60;

      const tokenPayload: TokenPayload = { email: payload.email };

      if (timeToExpire < 20) {
        return {
          accessToken: this.generateToken(tokenPayload, 'auth'),
          refreshToken: this.generateToken(tokenPayload, 'refresh'),
        };
      }

      return {
        accessToken: this.generateToken(tokenPayload, 'auth'),
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /** Obtener payload de un token */
  getPayload(token: string, type: 'auth' | 'refresh' = 'auth'): Payload {
    return verify(token, config[type].secret) as Payload;
  }
}

