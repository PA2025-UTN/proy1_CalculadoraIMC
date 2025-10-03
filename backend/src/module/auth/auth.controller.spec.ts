import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Debería registrar un usuario', async () => {
    const dto: RegisterDTO = {
      usuario: 'nuevo',
      email: 'nuevo@test.com',
      password: '123456',
    };

    (mockAuthService.register as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await controller.register(dto);
    expect(result).toEqual({ id: 1 });
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('Debería loguear un usuario', async () => {
    const dto: LoginDTO = {
      email: 'test@test.com',
      password: '123456',
    };

    const tokens = {
      accessToken: 'token',
      refreshToken: 'token',
    };

    (mockAuthService.login as jest.Mock).mockResolvedValue(tokens);

    const result = await controller.login(dto);
    expect(result).toEqual(tokens);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('Debería refrescar el token', async () => {
    const refreshToken = 'old-refresh-token';
    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    const mockRequest = {
      headers: {
        'refresh-token': refreshToken
      }
    } as any;

    (mockAuthService.refreshToken as jest.Mock).mockResolvedValue(newTokens);

    const result = await controller.refreshToken(mockRequest);
    expect(result).toEqual(newTokens);
    expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
  });
});
