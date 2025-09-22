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
}
