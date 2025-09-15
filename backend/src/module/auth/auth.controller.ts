import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { IUserActive } from 'src/common/interfaces/user-active';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@ActiveUser() user: IUserActive) {
    return user;
  }

  @Get('refresh-token')
  refreshToken(@Req() request: Request) {
    return this.authService.refreshToken(
      request.headers['refresh-token'] as string,
    );
  }

}
