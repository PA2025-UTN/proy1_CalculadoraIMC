import { Injectable } from "@nestjs/common";
import { EstadisticasRepository } from "./repositories/estadisticas.repository";

@Injectable()
export class EstadisticasService {
  constructor(
    private readonly estadisticasRepository: EstadisticasRepository,
  ) { }

  async getResumen(userId: number) {
    const raw = await this.estadisticasRepository.getResumen(userId);
    return {
      promedio: parseFloat(raw.promedio) || 0,
      minimo: parseFloat(raw.minimo) || 0,
      maximo: parseFloat(raw.maximo) || 0,
      total: parseInt(raw.total, 10) || 0,
    };
  }

  async getSerieIMC(userId: number) {
    return this.estadisticasRepository.getSerieIMC(userId);
  }

  async getSeriePeso(userId: number) {
    return this.estadisticasRepository.getSeriePeso(userId);
  }

  async getDistribucionCategorias(userId: number) {
    return this.estadisticasRepository.getDistribucionCategorias(userId);
  }
}

