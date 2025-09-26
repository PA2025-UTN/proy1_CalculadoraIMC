import { Module } from '@nestjs/common';
import { ImcModule } from './module/imc/imc.module';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { EstadisticasModule } from './module/estadisticas/estadisticas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as "mysql" | "postgres",
      host: process.env.DB_TYPE === 'postgres' ? process.env.PG_HOST : process.env.MYSQL_HOST,
      port: process.env.DB_TYPE === 'postgres' ? parseInt(process.env.PG_PORT || '5432', 10) : parseInt(process.env.MYSQL_PORT || '3306', 10),
      username: process.env.DB_TYPE === 'postgres' ? process.env.PG_USERNAME : process.env.MYSQL_USERNAME,
      password: process.env.DB_TYPE === 'postgres' ? process.env.PG_PASSWORD : process.env.MYSQL_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      ssl: process.env.DB_TYPE === 'postgres' ? { rejectUnauthorized: false } : undefined
    }),
    ImcModule,
    AuthModule,
    UsersModule,
    EstadisticasModule
  ],
})

export class AppModule { }
