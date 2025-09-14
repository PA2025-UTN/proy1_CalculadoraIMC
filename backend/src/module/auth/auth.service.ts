import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { RegisterDTO } from './dto/register.dto';
import { compareSync, hashSync } from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { config } from 'src/common/config/JwtConfig';
import { Payload } from 'src/common/interfaces/payload';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async register(body: RegisterDTO) {
    const userExists = await this.usersService.findByEmail(body.email);

    if (userExists) {
      throw new HttpException('User already exists', 400);
    }

    const user = new User();
    Object.assign(user, body);

    user.password = hashSync(user.password, 10);

    await this.usersService.createUser(user);
    return user;

  }

  async login(body: LoginDTO) {
    const user = await this.usersService.findByEmailWithPassword(body.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const compareResult = compareSync(body.password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException('Wrong password');
    }

    return {
      accessToken: this.generateToken({ email: user.email }, 'auth'),
      refreshToken: this.generateToken({ email: user.email }, 'refresh'),
    };
  }

  generateToken(
    payload: { email: string },
    type: 'refresh' | 'auth' = 'auth',
  ): string {
    return sign(payload, config[type].secret, {
      expiresIn: config[type].expiresIn,
    });
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = verify(
        refreshToken,
        config.refresh.secret,
      ) as Payload;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60;

      if (timeToExpire < 20) {
        return {
          accessToken: this.generateToken({ email: payload.email }),
          refreshToken: this.generateToken({ email: payload.email }, 'refresh'),
        };
      }

      return {
        accessToken: this.generateToken({ email: payload.email }),
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  getPayload(
    token: string,
    type: 'refresh' | 'auth' = 'auth'
  ) {
    return verify(token, config[type].secret) as Payload;
  }

}

