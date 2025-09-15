import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      createUser: jest.fn(),
      getUsers: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      imports : [],
      controllers: [UsersController],
      providers: [UsersService,
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
