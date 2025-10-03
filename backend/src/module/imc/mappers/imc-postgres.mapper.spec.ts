import { ImcPostgresMapper } from './imc-postgres.mapper';
import { Imc } from '../entities/imc.entity';
import { ImcModel } from '../models/imc.model';
import { User } from '@/module/users/entities/user.entity';

describe('ImcPostgresMapper', () => {
  
  it('Debería mapear Imc entity a ImcModel', () => {
    const user: User = {
      id: 1,
      usuario: 'testuser',
      email: 'test@example.com',
      password: 'pass',
    };

    const imc: Imc = {
      id: 100,
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal',
      fecha: new Date('2025-01-01'),
      user: user,
    };

    const result = ImcPostgresMapper.toModel(imc);

    expect(result).toEqual({
      id: '100',
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal',
      fecha: new Date('2025-01-01'),
      userId: '1',
    });
  });

  it('Debería mapear ImcModel a Imc entity', () => {
    const model: ImcModel = {
      id: '200',
      peso: 80,
      altura: 1.80,
      imc: 24.69,
      categoria: 'Peso normal',
      fecha: new Date('2025-02-01'),
      userId: '5',
    };

    const result = ImcPostgresMapper.toEntity(model);

    expect(result.id).toBe(200);
    expect(result.peso).toBe(80);
    expect(result.altura).toBe(1.80);
    expect(result.imc).toBe(24.69);
    expect(result.categoria).toBe('Peso normal');
    expect(result.fecha).toEqual(new Date('2025-02-01'));
    expect(result.user.id).toBe(5);
  });

  it('Debería manejar ImcModel sin id', () => {
    const model: ImcModel = {
      peso: 75,
      altura: 1.70,
      imc: 25.95,
      categoria: 'Sobrepeso',
      fecha: new Date('2025-03-01'),
      userId: '10',
    };

    const result = ImcPostgresMapper.toEntity(model);

    expect(result.id).toBeUndefined();
    expect(result.peso).toBe(75);
    expect(result.user.id).toBe(10);
  });

  it('Debería convertir ids correctamente en toModel', () => {
    const user: User = {
      id: 42,
      usuario: 'user42',
      email: 'user42@test.com',
      password: 'pass',
    };

    const imc: Imc = {
      id: 999,
      peso: 65,
      altura: 1.65,
      imc: 23.88,
      categoria: 'Peso normal',
      fecha: new Date(),
      user: user,
    };

    const result = ImcPostgresMapper.toModel(imc);

    expect(typeof result.id).toBe('string');
    expect(result.id).toBe('999');
    expect(typeof result.userId).toBe('string');
    expect(result.userId).toBe('42');
  });

  it('Debería convertir string ids a numbers en toEntity', () => {
    const model: ImcModel = {
      id: '777',
      peso: 90,
      altura: 1.85,
      imc: 26.30,
      categoria: 'Sobrepeso',
      fecha: new Date(),
      userId: '88',
    };

    const result = ImcPostgresMapper.toEntity(model);

    expect(typeof result.id).toBe('number');
    expect(result.id).toBe(777);
    expect(typeof result.user.id).toBe('number');
    expect(result.user.id).toBe(88);
  });
});
