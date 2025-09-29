import { Inject, Injectable } from "@nestjs/common";
import { IEstadisticasRepository } from "./repositories/estadisticas.repository.interface";

@Injectable()
export class EstadisticasService {
  constructor(
    @Inject('IEstadisticasRepository')
    private readonly repository: IEstadisticasRepository,
  ) { }

  async getResumen(userId: string) {
    const raw = await this.repository.getResumen(userId);

    return {
      imcPromedio: raw.imc_promedio ? raw.imc_promedio.toFixed(2) : '0.00',
      imcMinimo: raw.imc_minimo ?? 0,
      imcMaximo: raw.imc_maximo ?? 0,
      pesoPromedio: raw.peso_promedio ? raw.peso_promedio.toFixed(2) : '0.00',
      pesoMinimo: raw.peso_minimo ?? 0,
      pesoMaximo: raw.peso_maximo ?? 0,
      alturaPromedio: raw.altura_promedio ? raw.altura_promedio.toFixed(2) : '0.00',
      alturaMinimo: raw.altura_minimo ?? 0,
      alturaMaximo: raw.altura_maximo ?? 0,
      imcUltimo: raw.imc_ultimo ?? 0,
      pesoUltimo: raw.peso_ultimo ?? 0,
      alturaUltimo: raw.altura_ultimo ?? 0,
      fechaUltimo: raw.fecha_ultimo
        ? new Date(raw.fecha_ultimo).toLocaleString("es-AR", { timeZone: "America/Belize" })
        : null,
      total: raw.total ?? 0,
    };
  }

  async getSerieIMC(userId: string) {
    return this.repository.getSerieIMC(userId);
  }

  async getSeriePeso(userId: string) {
    return this.repository.getSeriePeso(userId);
  }

  async getDistribucionCategorias(userId: string) {
    return this.repository.getDistribucionCategorias(userId);
  }
}

