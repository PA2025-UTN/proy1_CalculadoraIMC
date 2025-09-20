import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ImcService } from './imc.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';

@UseGuards(AuthGuard)
@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) { }

  @Post('calcular')
  async calcularIMC(@ActiveUser() user: any, @Body() body: CalcularImcDto) {
    return this.imcService.calcularIMC(user.id, body.peso, body.altura);
  }

  @Get('historial')
  async obtenerHistorial(@ActiveUser() user: any) {
    return this.imcService.obtenerHistorial(user.id);
  }
}
