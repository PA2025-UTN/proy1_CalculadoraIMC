import { EstadisticasPostgresRepository } from './estadisticas-postgres.repository';
import { Repository } from 'typeorm';
import { Imc } from '../../imc/entities/imc.entity';


describe('EstadisticasPostgresRepository', () => {
  let repo: EstadisticasPostgresRepository;
  let mockRepo: Partial<Repository<Imc>>;

  beforeEach(() => {
    const qbMock = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({
        imc_promedio: '22.5',
        peso_promedio: '70.5',
        altura_promedio: '1.75',
        total: '10',
        imc_ultimo: '23.1',
        peso_ultimo: '72.0',
        altura_ultimo: '1.76',
        fecha_ultimo: new Date('2025-09-29T12:00:00Z'),
      }),
      getRawMany: jest.fn().mockResolvedValue([{ categoria: 'Normal', count: '5' }]),
    };

    mockRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(qbMock),
      find: jest.fn().mockResolvedValue([{ fecha: new Date(), imc: 22 }] as any),
    };

    repo = new EstadisticasPostgresRepository(mockRepo as Repository<Imc>);
  });

  it('should return resumen', async () => {
    const result = await repo.getResumen(1);
    expect(result.imc_promedio).toBe('22.5');
  });

  it('should return serie IMC', async () => {
    const result = await repo.getSerieIMC(1);
    expect(result[0]).toHaveProperty('imc');
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      order: { fecha: 'ASC' },
      select: ['fecha', 'imc'],
    });
  });

  it('should return serie Peso', async () => {
    (mockRepo.find as jest.Mock).mockResolvedValue([{ fecha: new Date(), peso: 70 }]);
    const result = await repo.getSeriePeso(1);
    expect(result[0]).toHaveProperty('peso');
  });

  it('should return categorias', async () => {
    const result = await repo.getDistribucionCategorias(1);
    expect(result[0]).toEqual({ categoria: 'Normal', count: '5' });
  });
});
