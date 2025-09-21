import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(() => {
    mockUsersService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      findByEmailWithPassword: jest.fn(),
    };

    authService = new AuthService(mockUsersService as UsersService);
  });

  it('Debería registrar un usuario nuevo', async () => {
    const dto: RegisterDTO = {
      usuario: 'Santiago',
      email: 'test@test.com',
      password: '123456',
    };

    (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');
    (mockUsersService.createUser as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await authService.register(dto);
    expect(result).toEqual({ id: 1 });
  });

  it('Debería devolver tokens si el login es válido', async () => {
    const dto: LoginDTO = { email: 'test@test.com', password: '123456' };

    (mockUsersService.findByEmailWithPassword as jest.Mock).mockResolvedValue({
      email: dto.email,
      password: 'hashedpass',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    const result = await authService.login(dto);
    expect(result).toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    });
  });

  it('Debería lanzar excepción si la contraseña es incorrecta', async () => {
    (mockUsersService.findByEmailWithPassword as jest.Mock).mockResolvedValue({
      email: 'test@test.com',
      password: 'hashedpass',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login({ email: 'test@test.com', password: '654321' }))
      .rejects.toThrow('Contraseña incorrecta');
  });
});
