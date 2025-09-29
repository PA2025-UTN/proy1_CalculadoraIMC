import { ImcMapper } from './imc.mapper';
import { Imc } from '../entities/imc.entity';
import { ImcModel } from '../models/imc.model';

describe('ImcMapper', () => {
  it('Debería mapear Imc entity a ImcModel', () => {
    const entity: Imc = {
      id: 1,
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'normal',
      fecha: new Date('2025-09-29T12:00:00Z'),
      user: { id: 42 } as any,
    };

    const model = ImcMapper.toModel(entity);

    expect(model).toEqual({
      id: '1',
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'normal',
      fecha: new Date('2025-09-29T12:00:00Z'),
      userId: '42',
    });
  });

  it('Debería mapear ImcModel a Imc', () => {
    const model: ImcModel = {
      id: '1',
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'normal',
      fecha: new Date('2025-09-29T12:00:00Z'),
      userId: '42',
    };

    const entity = ImcMapper.toEntity(model);

    expect(entity).toEqual({
      id: 1,
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'normal',
      fecha: new Date('2025-09-29T12:00:00Z'),
      user: { id: 42 },
    });
  });

  it('Debería mapear ImcModel a Imc', () => {
    const model: ImcModel = {
      id: undefined,
      peso: 65,
      altura: 1.70,
      imc: 22.49,
      categoria: 'normal',
      fecha: new Date(),
      userId: '99',
    };

    const entity = ImcMapper.toEntity(model);
    expect(entity.id).toBeUndefined();
    expect(entity.user.id).toBe(99);
  });
});
