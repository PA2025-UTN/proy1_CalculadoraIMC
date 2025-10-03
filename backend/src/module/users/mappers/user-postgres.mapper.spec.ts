import { UserPostgresMapper } from './user-postgres.mapper';
import { User } from '../entities/user.entity';
import { UserModel } from '../models/user.model';

describe('UserPostgresMapper', () => {
  
  it('Debería mapear User entity a UserModel', () => {
    const user: User = {
      id: 123,
      usuario: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    const result = UserPostgresMapper.toModel(user);

    expect(result).toEqual({
      id: '123',
      usuario: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
    });
  });

  it('Debería mapear UserModel a User entity', () => {
    const model: UserModel = {
      id: '456',
      usuario: 'testuser2',
      email: 'test2@example.com',
      password: 'hashedpassword2',
    };

    const result = UserPostgresMapper.toEntity(model);

    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe(456);
    expect(result.usuario).toBe('testuser2');
    expect(result.email).toBe('test2@example.com');
    expect(result.password).toBe('hashedpassword2');
  });

  it('Debería manejar id como string en toModel', () => {
    const user: User = {
      id: 1,
      usuario: 'user',
      email: 'user@test.com',
      password: 'pass',
    };

    const result = UserPostgresMapper.toModel(user);

    expect(typeof result.id).toBe('string');
    expect(result.id).toBe('1');
  });

  it('Debería convertir string id a number en toEntity', () => {
    const model: UserModel = {
      id: '999',
      usuario: 'user999',
      email: 'user999@test.com',
      password: 'pass999',
    };

    const result = UserPostgresMapper.toEntity(model);

    expect(typeof result.id).toBe('number');
    expect(result.id).toBe(999);
  });
});
