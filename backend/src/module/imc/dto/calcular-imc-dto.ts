import { IsNumber, Min } from 'class-validator';

export class CalcularImcDto {
  @IsNumber()
  @Min(0.1) // Altura mínima razonable
  altura: number;

  @IsNumber()
  @Min(1) // Peso mínimo razonable
  peso: number;
}
