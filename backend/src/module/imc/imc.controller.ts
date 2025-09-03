import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';


@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Post('calcular')
  calcular(@Body(ValidationPipe) data: CalcularImcDto) {
    return this.imcService.calcularImc(data);
  }
}
