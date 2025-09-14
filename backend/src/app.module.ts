import { Module } from '@nestjs/common';
import { ImcModule } from './module/imc/imc.module';
import { AuthModule } from './module/auth/auth.module';
import { HistorialModule } from './module/historial/historial.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as "mysql" | "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    ImcModule,
    AuthModule,
    HistorialModule,
    UsersModule
  ],
})

export class AppModule { }
