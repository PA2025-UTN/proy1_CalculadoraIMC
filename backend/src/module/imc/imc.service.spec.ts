import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Imc } from "./entities/imc.entity";
import { ImcPostgresRepository } from "./repositories/imc-postgres.repository";

describe('ImcService', () => {
  let service: ImcService;
  let userService: UsersService;
  let usuario: User;
  let imcRepo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(async () => {
    imcRepo = {
      create: jest.fn().mockReturnValue({
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'Peso normal',
        user: { id: 1, usuario: 'testUser', email: 'test@test.com', password: '123456', imc: [] },
      }),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ImcService,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn().mockResolvedValue({
              id: 1,
              usuario: 'testUser',
              email: 'test@test.com',
              password: '123456',
              imc: [],
            }),
          },
        },
        {
          provide: ImcPostgresRepository,
          useValue: imcRepo
        }
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
    userService = module.get<UsersService>(UsersService);

    usuario = await userService.findById(1) as User;

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate IMC correctly', async () => {
    const dto: CalcularImcDto = { peso: 70, altura: 1.75 };
    imcRepo.create.mockReturnValue({ peso: dto.peso, altura: dto.altura, imc: 22.86, categoria: 'Peso normal', user: usuario });
    imcRepo.save.mockReturnValue({ peso: dto.peso, altura: dto.altura, imc: 22.86, categoria: 'Peso normal', user: usuario });

    const result = await service.calcularIMC(usuario.id, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(22.86, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Peso normal');
  });

  it('should return Bajo peso for IMC < 18.5', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    imcRepo.create.mockResolvedValue({ peso: 50, altura: 1.75, imc: 16.33, categoria: 'Bajo peso', user: usuario });
    imcRepo.save.mockResolvedValue({ peso: 50, altura: 1.75, imc: 16.33, categoria: 'Bajo peso', user: usuario });

    const result = await service.calcularIMC(usuario.id, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    imcRepo.create.mockResolvedValue({ peso: 80, altura: 1.75, imc: 26.12, categoria: 'Sobrepeso', user: usuario, });
    imcRepo.save.mockResolvedValue({ peso: 80, altura: 1.75, imc: 26.12, categoria: 'Sobrepeso', user: usuario, });

    const result = await service.calcularIMC(usuario.id, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Obeso for IMC >= 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    imcRepo.create.mockResolvedValue({ peso: 100, altura: 1.75, imc: 32.65, categoria: 'Obesidad', user: usuario, });
    imcRepo.save.mockResolvedValue({ peso: 100, altura: 1.75, imc: 32.65, categoria: 'Obesidad', user: usuario, });

    const result = await service.calcularIMC(usuario.id, dto.peso, dto.altura);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obesidad');
  });
});
