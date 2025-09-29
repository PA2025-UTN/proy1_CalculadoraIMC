import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { IUserActive } from '@/common/interfaces/user-active';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('EstadisticasController', () => {
  let controller: EstadisticasController;
  let service: EstadisticasService;

  const mockEstadisticasService = {
  getResumen: jest.fn().mockResolvedValue({ imcPromedio: '22.50', total: 10 }),
  getSerieIMC: jest.fn().mockResolvedValue([{ fecha: new Date(), imc: 22 }]),
  getSeriePeso: jest.fn().mockResolvedValue([{ fecha: new Date(), peso: 70 }]),
  getDistribucionCategorias: jest.fn().mockResolvedValue([{ categoria: 'Normal', count: '5' }]),
  };

  const mockUsuario: IUserActive = {
    id: 1,
    usuario: 'gonzalo',
    email: 'gonzalo@gmail.com',
  } as IUserActive;

  const mockAuthGuard: CanActivate = {
        canActivate: jest.fn(() => true),
      };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadisticasController],
      providers: [
        {
          provide: EstadisticasService,
          useValue: mockEstadisticasService
        },
        {
          provide: 'AuthGuard',
          useValue: mockAuthGuard,
        }
      ],
    }).overrideGuard(AuthGuard).useValue(mockAuthGuard).compile();

    controller = module.get<EstadisticasController>(EstadisticasController);
    service = module.get<EstadisticasService>(EstadisticasService);
  });

  it('Debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('Debería devolver resumen', async () => {
  const result = await controller.getResumen(mockUsuario);
  expect(result).toEqual({imcPromedio: '22.50', total: 10});
  expect(mockEstadisticasService.getResumen).toHaveBeenCalledWith(mockUsuario.id);
  });

  it('Debería devolver serie-imc', async() => {
    const result = await controller.getSerieIMC(mockUsuario);
    expect(result).toEqual([{ fecha: expect.any(Date), imc: 22 }]);
    expect(mockEstadisticasService.getSerieIMC).toHaveBeenCalledWith(mockUsuario.id);
  });

  it('Debería devolver serie-peso', async () => {
    const result = await controller.getSeriePeso(mockUsuario);
    expect(result).toEqual([{ fecha: expect.any(Date), peso: 70 }]);
    expect(mockEstadisticasService.getSeriePeso).toHaveBeenCalledWith(mockUsuario.id);
  });

  it('Debería devolver distribución de categorias', async () => {
    const result = await controller.getDistribucionCategorias(mockUsuario);
    expect(result).toEqual([{ categoria: 'Normal', count: '5' }]);
    expect(mockEstadisticasService.getDistribucionCategorias).toHaveBeenCalledWith(mockUsuario.id);
  });

});
