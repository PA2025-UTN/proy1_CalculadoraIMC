import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, CanActivate, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('ImcController', () => {
  let controller: ImcController;
  let service: Partial<ImcService>;

  const mockAuthGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ImcController],
      providers: [
        {
          provide: ImcService,
          useValue: {
            calcularIMC: jest.fn(),
            obtenerHistorial: jest.fn(),
          },
        },
        {
        provide: 'AuthGuard',
        useValue: mockAuthGuard,
        },
      ],
    }).overrideGuard(AuthGuard).useValue(mockAuthGuard).compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return IMC and category for valid input', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const usuarioMock = { id: 1, usuario: 'testUser', email: 'test@example.com', password: '123', imc: [] }
    const resultadoEsperado = {
      id: 1,
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal',
      fecha: new Date(),
      user: usuarioMock,
    };
    jest.spyOn(service, 'calcularIMC').mockResolvedValue(resultadoEsperado);
    const resultado = await controller.calcularIMC(usuarioMock, dto);
    expect(resultado).toEqual(resultadoEsperado);
    expect(service.calcularIMC).toHaveBeenCalledWith(usuarioMock.id, dto.peso, dto.altura);
  });

  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };

    // Aplicar ValidationPipe manualmente en la prueba
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

    await expect(validationPipe.transform(invalidDto, { type: 'body', metatype: CalcularImcDto }))
      .rejects.toThrow(BadRequestException);

    // Verificar que el servicio no se llama porque la validación falla antes
    expect(service.calcularIMC).not.toHaveBeenCalled();
  });
});
