import { ImcPostgresRepository } from './imc-postgres.repository';
import { Repository } from 'typeorm';
import { Imc } from '../entities/imc.entity';
import { ImcModel } from '../models/imc.model';
import { HistorialQueryDto } from '../dto/historial-query-dto';

describe('ImcPostgresRepository', () => {
  let repo: ImcPostgresRepository;
  let mockRepo: Partial<Repository<Imc>>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      find: jest.fn(),
    };

    repo = new ImcPostgresRepository(mockRepo as Repository<Imc>);
  });

  it('should save an ImcModel and return mapped result', async () => {
    const model: ImcModel = {
      id: '1',
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal',
      fecha: new Date('2025-09-29T12:00:00Z'),
      userId: '42',
    };

    const entity: Imc = {
      id: 1,
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal',
      fecha: model.fecha,
      user: { id: 42 } as any,
    };

    (mockRepo.save as jest.Mock).mockResolvedValue(entity);

    const result = await repo.save(model);
    expect(result).toEqual(model);
    expect(mockRepo.save).toHaveBeenCalledWith(entity);
  });

  it('should find all Imc entities by userId and return mapped models', async () => {
    const entities: Imc[] = [
      {
        id: 1,
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'normal',
        fecha: new Date('2025-09-29T12:00:00Z'),
        user: { id: 42 } as any,
      },
    ];

    (mockRepo.find as jest.Mock).mockResolvedValue(entities);

    const result = await repo.findByUserId('42');

    expect(result).toEqual([
      {
        id: '1',
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'normal',
        fecha: entities[0].fecha,
        userId: '42',
      },
    ]);

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 42 } },
      order: { fecha: 'DESC' },
    });
  });

  it('should apply filters and return historial', async () => {
    const filtros: HistorialQueryDto = {
      from: '2025-08-01',
      to: '2025-09-29',
      categoria: ['normal'],
      orderBy: 'imc',
      direction: 'asc',
    };

    const entities: Imc[] = [
      {
        id: 1,
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'normal',
        fecha: new Date('2025-09-01'),
        user: { id: 42 } as any,
      },
    ];

    (mockRepo.find as jest.Mock).mockResolvedValue(entities);

    const result = await repo.findHistorial('42', filtros);

    expect(result).toEqual([
      {
        id: '1',
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'normal',
        fecha: entities[0].fecha,
        userId: '42',
      },
    ]);

    expect(mockRepo.find).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        user: { id: 42 },
        fecha: expect.any(Object),
        categoria: 'Peso normal',
      }),
      order: { imc: 'ASC' },
      relations: { user: true },
    }));
  });

  it('should create ImcModel with default fecha if missing', () => {
    const partial = {
      peso: 65,
      altura: 1.70,
      imc: 22.49,
      categoria: 'normal',
      userId: '42',
    };

    const result = repo.create(partial);
    expect(result.fecha).toBeInstanceOf(Date);
    expect(result.peso).toBe(65);
    expect(result.userId).toBe('42');
  });
});
