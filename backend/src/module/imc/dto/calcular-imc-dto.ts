import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CalcularImcDto {
  @IsNumber()
  @IsPositive()
  @Min(0.1, { message: "La altura debe ser mayor a 0 m" }) // Altura mínima razonable
  @Max(3, { message: "La altura no puede ser mayor a 3 m" })
  altura: number;

  @IsNumber()
  @IsPositive()
  @Min(1, { message: "El peso debe ser mayor a 1 kg" }) // Peso mínimo razonable
  @Max(500, { message: "El peso no puede superar los 500 kg" })
  peso: number;
}
