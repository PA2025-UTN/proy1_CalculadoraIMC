import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { HistorialQueryDto } from "./dto/historial-query-dto";
import { ImcRepository } from "./repositories/imc.repository";

@Injectable()
export class ImcService {
  constructor(
    private readonly repository: ImcRepository,
    private readonly usersService: UsersService,
  ) { }

  async calcularIMC(userId: number, peso: number, altura: number, fecha?: Date) {
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100;

    let categoria: string;
    if (imc < 18.5) categoria = 'Bajo peso';
    else if (imc < 25) categoria = 'Peso normal';
    else if (imc < 30) categoria = 'Sobrepeso';
    else categoria = 'Obesidad';

    const user = await this.usersService.findById(userId);
    if (!user) throw new Error(`Usuario ${userId} no encontrado`);

    const resultado = this.repository.create({
      peso,
      altura,
      imc: imcRedondeado,
      categoria,
      fecha,
      user,
    });

    return this.repository.save(resultado);
  }

  async obtenerHistorial(userId: number, filtros: HistorialQueryDto) {
    return this.repository.findHistorial(userId, filtros);
  }
}

