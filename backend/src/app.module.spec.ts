import { Test, TestingModule } from '@nestjs/testing';
import { ImcModule } from './module/imc/imc.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { EstadisticasModule } from './module/estadisticas/estadisticas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
dotenv.config({ path: '.env.test' });

describe.skip('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ImcModule,
    AuthModule,
    UsersModule,
    EstadisticasModule,
  ],
    }).compile();
  }, 5000);

  it('should compile the AppModule', () => {
    expect(module).toBeDefined();
  });

  it('should import ImcModule', () => {
    const imcModule = module.get(ImcModule);
    expect(imcModule).toBeDefined();
  });
});

