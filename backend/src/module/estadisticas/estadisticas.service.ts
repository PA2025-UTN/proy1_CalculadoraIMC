import { Injectable } from "@nestjs/common";
import { EstadisticasRepository } from "./repositories/estadisticas.repository";

@Injectable()
export class EstadisticasService {
  constructor(
    private readonly repository: EstadisticasRepository,
  ) { }

  async getResumen(userId: number) {
    const raw = await this.repository.getResumen(userId);
    return {
      imcPromedio: parseFloat(raw.imc_promedio).toFixed(2) || 0,
      imcMinimo: parseFloat(raw.imc_minimo) || 0,
      imcMaximo: parseFloat(raw.imc_maximo) || 0,
      pesoPromedio: parseFloat(raw.peso_promedio).toFixed(2) || 0,
      pesoMinimo: parseFloat(raw.peso_minimo) || 0,
      pesoMaximo: parseFloat(raw.peso_maximo) || 0,
      alturaPromedio: parseFloat(raw.altura_promedio).toFixed(2) || 0,
      alturaMinimo: parseFloat(raw.altura_minimo) || 0,
      alturaMaximo: parseFloat(raw.altura_maximo) || 0,
      imcUltimo: parseFloat(raw.imc_ultimo) || 0,
      pesoUltimo: parseFloat(raw.peso_ultimo) || 0,
      alturaUltimo: parseFloat(raw.altura_ultimo) || 0,
      total: parseInt(raw.total, 10) || 0,
    };
  }

  async getSerieIMC(userId: number) {
    return this.repository.getSerieIMC(userId);
  }

  async getSeriePeso(userId: number) {
    return this.repository.getSeriePeso(userId);
  }

  async getDistribucionCategorias(userId: number) {
    return this.repository.getDistribucionCategorias(userId);
  }
}

