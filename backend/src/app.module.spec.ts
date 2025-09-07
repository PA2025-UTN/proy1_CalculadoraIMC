import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ImcModule } from './module/imc/imc.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should compile the AppModule', () => {
    expect(module).toBeDefined();
  });

  it('should import ImcModule', () => {
    const imcModule = module.get(ImcModule);
    expect(imcModule).toBeDefined();
  });
});

