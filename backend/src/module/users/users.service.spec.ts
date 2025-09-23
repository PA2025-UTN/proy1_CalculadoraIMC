import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserRepository: Partial<UserRepository> = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(UserRepository);
    
  });

  it('Debería crear un usuario', async () => {
    const dto: CreateUserDto = { usuario: 'testUser', email: 'test@example.com', password: 'testPassword' };
    userRepository.createUser.mockResolvedValue({ id: 1, usuario: 'testUser', email: 'test@example.com', password: 'testPassword', imc: [] });

    const result = await service.createUser(dto);

    expect(result).toEqual({ id: 1, usuario: 'testUser', email: 'test@example.com', password: 'testPassword', imc: [] });
    expect(userRepository.createUser).toHaveBeenCalledWith(dto);
  });

  it('Debería encontrar un usuario por email', async () => {
    const email = 'test@example.com';
    userRepository.findByEmail.mockResolvedValue({ id: 1, usuario: 'testUser', email: 'test@example.com', password: 'testPassword', imc: [] });

    const result = await service.findByEmail(email);

    expect(result).toEqual({ id: 1, usuario: 'testUser', email: 'test@example.com', password: 'testPassword', imc: [] });
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email) ;
}); 

  it('Debería retornar todos los usuarios', async () => {
    const users: User[] = [
      { id: 1, usuario: 'user1', email: 'user1@example.com', password: 'pass1', imc: [] },
      { id: 2, usuario: 'user2', email: 'user2@example.com', password: 'pass2', imc: [] },
    ];
    (userRepository.getUsers as jest.Mock).mockResolvedValue(users);

    const result = await service.getUsers();

    expect(result).toEqual(users);
    expect(userRepository.getUsers).toHaveBeenCalled();
  });

  it('Debería encontrar un usuario por ID', async () => {
    const user: User = { id: 1, usuario: 'user1', email: 'user1@example.com', password: 'pass1', imc: [] };
    (userRepository.findById as jest.Mock).mockResolvedValue(user);

    const result = await service.findById(1);

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(1);
  });

  it('Debería encontrar un usuario por email incluyendo password', async () => {
    const email = 'usuario1@test.com';
    const usuario: User = { id: 1, usuario: 'user1', email, password: 'pass1', imc: []};
    (userRepository.findByEmailWithPassword as jest.Mock).mockResolvedValue(usuario);

    const result = await service.findByEmailWithPassword(email);

    expect(result).toEqual(usuario);
    expect(userRepository.findByEmailWithPassword).toHaveBeenCalledWith(email);
  });
 
});