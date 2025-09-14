import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      getUsers: jest.fn(),
      findById: jest.fn(),
      findByEmailWithPassword: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
