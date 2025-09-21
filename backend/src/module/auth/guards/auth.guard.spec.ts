import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';
import { ExecutionContext } from '@nestjs/common';
import { User } from 'src/module/users/entities/user.entity';
import { UsersService } from 'src/module/users/users.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UsersService>;

  beforeEach(() => {

    mockAuthService = {
        getPayload: jest.fn().mockReturnValue({ email: 'test@test.com'}),
    }

    mockUserService = {
        findByEmail: jest.fn().mockResolvedValue( { id: 1, email: 'test@example.com', usuario: 'testuser', password: 'hashedpass', imc: []} as User),
    }

    guard = new AuthGuard(mockAuthService as AuthService, mockUserService as UsersService);
  });
  
  const createMockContext = (token?: string, user?: Partial<User>): ExecutionContext => {
      return {
          switchToHttp: () => ({
              getRequest: () => ({
                  headers: {
                      authorization: token ? `Bearer ${token}` : undefined,
                  }
              })
          }),
      } as ExecutionContext;
  }
  it('Debería permitir acceso si el token es válido y el usuario existe', async () => {

    const contexto = createMockContext();
    await expect(guard.canActivate(contexto)).resolves.toBe(true);

  });

  it('Debería lanzar UnauthorizedException si no se envía token', async () => {
    const context = {
    switchToHttp: () => ({
      getRequest: () => ({ headers: {} }),
    }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Token no enviado');
  });

  it('Debería lanzar UnauthorizedException si el usuario no existe', async () => {
  (mockUserService.findByEmail as jest.Mock).mockReturnValue(undefined);

  const context = createMockContext();
  await expect(guard.canActivate(context)).rejects.toThrow('Usuario no encontrado');
});
});
