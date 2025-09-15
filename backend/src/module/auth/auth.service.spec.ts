import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {

    const mockUsersService: Partial<UsersService> = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    getUsers: jest.fn(),
    findById: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        }
      ],
    }).compile();
    
    service = module.get<AuthService>(AuthService); 
    usersService = module.get<UsersService>(UsersService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
