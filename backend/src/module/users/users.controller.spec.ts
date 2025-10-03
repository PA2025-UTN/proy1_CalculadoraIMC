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

  it('Debería crear un usuario', async () => {
    const createUserDto = { usuario: 'testuser', email: 'test@example.com', password: 'password123' };
    const expectedUser = { id: '1', ...createUserDto };
    
    (usersService.createUser as jest.Mock).mockResolvedValue(expectedUser);

    const result = await controller.createUser(createUserDto);

    expect(result).toEqual(expectedUser);
    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('Debería retornar todos los usuarios', async () => {
    const expectedUsers = [
      { id: '1', usuario: 'user1', email: 'user1@test.com', password: 'pass1' },
      { id: '2', usuario: 'user2', email: 'user2@test.com', password: 'pass2' },
    ];
    
    (usersService.getUsers as jest.Mock).mockResolvedValue(expectedUsers);

    const result = await controller.getUsers();

    expect(result).toEqual(expectedUsers);
    expect(usersService.getUsers).toHaveBeenCalled();
  });
});
