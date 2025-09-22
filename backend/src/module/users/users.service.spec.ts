import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Imc } from '../imc/entities/imc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserRepository } from './repositories/user.repository';
dotenv.config();

jest.setTimeout(20000);
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let imcRepository: Repository<Imc>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [User, Imc],
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    service = module.get(UsersService);

    const dataSource = module.get<DataSource>(DataSource);

    const userRepository = dataSource.getRepository(User);
    const imcRepository = dataSource.getRepository(Imc);

    await clearTable(imcRepository);
    await clearTable(userRepository);
  });
  
  it('Debería guardar y encontrar al usuario en la db', async () => {
    const dto = {
      usuario: 'testUser',
      email: 'test@example.com',
      password: 'securePassword',
    };

    const savedUser = await service.createUser(dto);
    const foundUser = await service.findByEmail(dto.email);

    expect(savedUser).toHaveProperty('id');
    expect(foundUser?.email).toBe(dto.email);
    expect(foundUser?.usuario).toBe(dto.usuario);
    expect(foundUser?.password).toBe(dto.password);

  });

  async function clearTable<T>(repository: Repository<any>) {
    const items = await repository.find();
    if (items.length > 0) {
      await repository.delete(items.map(item => (item as any).id));
    }
  }

});

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