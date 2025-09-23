import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ImcModule } from './module/imc/imc.module';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  }, 15000);

  it('should compile the AppModule', () => {
    expect(module).toBeDefined();
  });

  it('should import ImcModule', () => {
    const imcModule = module.get(ImcModule);
    expect(imcModule).toBeDefined();
  });
});

