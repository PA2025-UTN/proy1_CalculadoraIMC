import { UserPostgresRepository } from './user-postgres.repository';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserPostgresRepository', () => {
  let repo: UserPostgresRepository;
  let mockRepo: Partial<Repository<User>>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    repo = new UserPostgresRepository(mockRepo as Repository<User>);
  });

  it('Debería crear un usuario', async () => {
    const dto: CreateUserDto = { usuario: 'testUser', email: 'test@example.com', password: '123' };
    (mockRepo.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

    const result = await repo.createUser(dto);
    expect(result.id).toBe('1');
    expect(result.usuario).toBe(dto.usuario);
    expect(result.email).toBe(dto.email);
    expect(mockRepo.save).toHaveBeenCalledWith(dto);
  });

  it('Debería obtener todos los usuarios', async () => {
    const users = [{ id: 1, usuario: 'user1', email: 'u1@test.com', password: '123' }];
    (mockRepo.find as jest.Mock).mockResolvedValue(users);

    const result = await repo.getUsers();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('Debería encontrar un usuario por ID', async () => {
    const user = { id: 1, usuario: 'user1', email: 'u1@test.com', password: '123' };
    (mockRepo.findOne as jest.Mock).mockResolvedValue(user);

    const result = await repo.findById('1');
    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('Debería encontrar un usuario por email', async () => {
    const user = { id: 1, usuario: 'user1', email: 'u1@test.com', password: '123' };
    (mockRepo.findOneBy as jest.Mock).mockResolvedValue(user);

    const result = await repo.findByEmail('u1@test.com');
    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: 'u1@test.com' });
  });

  it('Debería encontrar un usuario por email incluyendo password', async () => {
    const user = { id: 1, usuario: 'user1', email: 'u1@test.com', password: '123' };
    (mockRepo.findOne as jest.Mock).mockResolvedValue(user);

    const result = await repo.findByEmailWithPassword('u1@test.com');
    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'u1@test.com' },
      select: ['id', 'usuario', 'email', 'password'],
    });
  });

});
