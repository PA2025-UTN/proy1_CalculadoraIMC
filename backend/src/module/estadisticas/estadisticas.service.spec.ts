import { EstadisticasService } from './estadisticas.service';
import { IEstadisticasRepository } from './repositories/estadisticas.repository.interface';

describe('EstadisticasService', () => {
  let service: EstadisticasService;
  let repository: jest.Mocked<IEstadisticasRepository>;

  beforeEach(() => {
    repository = {
      getResumen: jest.fn(),
      getSerieIMC: jest.fn(),
      getSeriePeso: jest.fn(),
      getDistribucionCategorias: jest.fn(),
    };

    service = new EstadisticasService(repository as any);
  });

  it('Debería formatear correctamente el resumen', async () => {
    repository.getResumen.mockResolvedValue({
      imc_promedio: '22.5',
      imc_minimo: '18.0',
      imc_maximo: '27.0',
      peso_promedio: '70.5',
      peso_minimo: '60.0',
      peso_maximo: '85.0',
      altura_promedio: '1.75',
      altura_minimo: '1.60',
      altura_maximo: '1.90',
      imc_ultimo: '23.1',
      peso_ultimo: '72.0',
      altura_ultimo: '1.76',
      fecha_ultimo: new Date('2025-09-29T12:00:00Z'),
      total: '10',
    });

    const result = await service.getResumen(42);

    expect(result).toEqual({
      imcPromedio: '22.50',
      imcMinimo: 18,
      imcMaximo: 27,
      pesoPromedio: '70.50',
      pesoMinimo: 60,
      pesoMaximo: 85,
      alturaPromedio: '1.75',
      alturaMinimo: 1.6,
      alturaMaximo: 1.9,
      imcUltimo: 23.1,
      pesoUltimo: 72,
      alturaUltimo: 1.76,
      fechaUltimo: expect.any(String),
      total: 10,
    });

    expect(repository.getResumen).toHaveBeenCalledWith(42);
  });

  it('Debería devolver serie IMC', async () => {
    const serie = [{ fecha: new Date(), imc: 22 }];
    repository.getSerieIMC.mockResolvedValue(serie);

    const result = await service.getSerieIMC(42);
    expect(result).toEqual(serie);
    expect(repository.getSerieIMC).toHaveBeenCalledWith(42);
  });

  it('Debería devolver serie Peso', async () => {
    const serie = [{ fecha: new Date(), peso: 70 }];
    repository.getSeriePeso.mockResolvedValue(serie);

    const result = await service.getSeriePeso(42);
    expect(result).toEqual(serie);
    expect(repository.getSeriePeso).toHaveBeenCalledWith(42);
  });

  it('Debería devolver categorias', async () => {
    const categorias = [{ categoria: 'Normal', count: '5' }];
    repository.getDistribucionCategorias.mockResolvedValue(categorias);

    const result = await service.getDistribucionCategorias(42);
    expect(result).toEqual(categorias);
    expect(repository.getDistribucionCategorias).toHaveBeenCalledWith(42);
  });
});

