import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { UsersService } from "../users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Imc } from "./entities/imc.entity";
import { ImcPostgresRepository } from "./repositories/imc-postgres.repository";

describe('ImcService', () => {
  let service: ImcService;
  let userService: UsersService;
  let userId: string;
  let imcRepo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findHistorial: jest.Mock;
  };

  beforeEach(async () => {
    imcRepo = {
      create: jest.fn().mockReturnValue({
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'Peso normal',
        user: { id: '1', usuario: 'testUser', email: 'test@test.com', password: '123456' },
      }),
      save: jest.fn(),
      find: jest.fn(),
      findHistorial: jest.fn().mockResolvedValue([]),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ImcService,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn().mockResolvedValue({
              id: '1',
              usuario: 'testUser',
              email: 'test@test.com',
              password: '123456',
            }),
          },
        },
        {
          provide: 'IImcRepository',
          useValue: imcRepo
        }
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
    userService = module.get<UsersService>(UsersService);

    userId = '1';

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia calcular el IMC correctamente', async () => {
    const dto: CalcularImcDto = { peso: 70, altura: 1.75 };
    imcRepo.create.mockReturnValue({ peso: dto.peso, altura: dto.altura, imc: 22.86, categoria: 'Peso normal', userId });
    imcRepo.save.mockReturnValue({ peso: dto.peso, altura: dto.altura, imc: 22.86, categoria: 'Peso normal', userId });

    const result = await service.calcularIMC(userId, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(22.86, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Peso normal');
  });

  it('deberia devolver Bajo peso para IMC < 18.5', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    imcRepo.create.mockResolvedValue({ peso: 50, altura: 1.75, imc: 16.33, categoria: 'Bajo peso', userId });
    imcRepo.save.mockResolvedValue({ peso: 50, altura: 1.75, imc: 16.33, categoria: 'Bajo peso', userId });

    const result = await service.calcularIMC(userId, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('deberia devolver Sobrepeso para 25 <= IMC < 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    imcRepo.create.mockResolvedValue({ peso: 80, altura: 1.75, imc: 26.12, categoria: 'Sobrepeso', userId, });
    imcRepo.save.mockResolvedValue({ peso: 80, altura: 1.75, imc: 26.12, categoria: 'Sobrepeso', userId, });

    const result = await service.calcularIMC(userId, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('deberia devolver Obeso para IMC >= 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    imcRepo.create.mockResolvedValue({ peso: 100, altura: 1.75, imc: 32.65, categoria: 'Obesidad', userId, });
    imcRepo.save.mockResolvedValue({ peso: 100, altura: 1.75, imc: 32.65, categoria: 'Obesidad', userId, });

    const result = await service.calcularIMC(userId, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obesidad');
  });

  it('deberia obtener historial con filtros', async () => {
    const filters = { from: '2025-01-01', to: '2025-12-31', categoria: ['normal'] as ('bajo' | 'normal' | 'sobrepeso' | 'obesidad' | 'all')[] };
    const historialMock = [
      { id: '1', peso: 70, altura: 1.75, imc: 22.86, categoria: 'Peso normal', fecha: new Date(), userId },
    ];

    (imcRepo.findHistorial as jest.Mock).mockResolvedValue(historialMock);

    const result = await service.obtenerHistorial(userId, filters);
    expect(result).toBeDefined();
    expect(result).toEqual(historialMock);
    expect(imcRepo.findHistorial).toHaveBeenCalledWith(userId, filters);
  });

  it('deberia calcular el IMC con fecha personalizada', async () => {
    const dto: CalcularImcDto = { peso: 70, altura: 1.75 };
    const customDate = new Date('2025-01-01');
    imcRepo.create.mockReturnValue({ peso: dto.peso, altura: dto.altura, imc: 22.86, categoria: 'Peso normal', userId, fecha: customDate });
    imcRepo.save.mockReturnValue({ peso: dto.peso, altura: dto.altura, imc: 22.86, categoria: 'Peso normal', userId, fecha: customDate });

    const result = await service.calcularIMC(userId, dto.peso, dto.altura, customDate);
    expect(result.fecha).toEqual(customDate);
  });
});
