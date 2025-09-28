import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ImcService } from './imc.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { IUserActive } from '@/common/interfaces/user-active';
import { HistorialQueryDto } from './dto/historial-query-dto';

@UseGuards(AuthGuard)
@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) { }

  @Post('calcular')
  async calcularIMC(@ActiveUser() user: IUserActive, @Body() body: CalcularImcDto) {
    return this.imcService.calcularIMC(user.id, body.peso, body.altura);
  }

  @Get("historial")
  async historial(
    @ActiveUser() user: IUserActive,
    @Query() query: HistorialQueryDto,
  ) {
    const userId = user.id
    return this.imcService.obtenerHistorial(userId, query)
  }

  @Post("seed")
  async seed(@ActiveUser() user: IUserActive) {
    const userId = user.id;
    for (let i = 0; i < 100; i++) {
      const peso = Math.floor(Math.random() * (120 - 45) + 45);
      const altura = +(Math.random() * (2.0 - 1.5) + 1.5).toFixed(2);

      // fecha random últimos 90 días
      const diasAtras = Math.floor(Math.random() * 90);
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - diasAtras);

      await this.imcService.calcularIMC(userId, peso, altura, fecha);
    }
    return { message: "100 registros generados con fechas random" };
  }
}
