import { Test, TestingModule } from '@nestjs/testing';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';

describe('HistorialController', () => {
  let controller: HistorialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialController],
      providers: [HistorialService],
    }).compile();

    controller = module.get<HistorialController>(HistorialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
