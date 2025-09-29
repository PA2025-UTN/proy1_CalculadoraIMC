import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImcMongo } from '../../imc/schemas/imc.schema';
import { IEstadisticasRepository } from './estadisticas.repository.interface';

@Injectable()
export class EstadisticasMongoRepository implements IEstadisticasRepository {
  constructor(
    @InjectModel(ImcMongo.name) private readonly imcModel: Model<ImcMongo>,
  ) { }

  async getResumen(userId: string) {
    const userFilter = { userId };

    // ultimo registro
    const ultimo = await this.imcModel
      .find(userFilter)
      .sort({ fecha: -1 })
      .limit(1)
      .lean();

    // promedio, mínimo, máximo, total
    const agregados = await this.imcModel.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: null,
          imc_promedio: { $avg: '$imc' },
          imc_minimo: { $min: '$imc' },
          imc_maximo: { $max: '$imc' },
          peso_promedio: { $avg: '$peso' },
          peso_minimo: { $min: '$peso' },
          peso_maximo: { $max: '$peso' },
          altura_promedio: { $avg: '$altura' },
          altura_minimo: { $min: '$altura' },
          altura_maximo: { $max: '$altura' },
          total: { $sum: 1 },
        },
      },
    ]);

    const resumen = agregados[0] || {};
    return {
      ...resumen,
      imc_ultimo: ultimo[0]?.imc || 0,
      peso_ultimo: ultimo[0]?.peso || 0,
      altura_ultimo: ultimo[0]?.altura || 0,
      fecha_ultimo: ultimo[0]?.fecha || 0,
    };
  }

  async getSerieIMC(userId: string) {
    return this.imcModel
      .find({ userId })
      .sort({ fecha: 1 })
      .select({ fecha: 1, imc: 1, _id: 0 })
      .lean();
  }

  async getSeriePeso(userId: string) {
    return this.imcModel
      .find({ userId })
      .sort({ fecha: 1 })
      .select({ fecha: 1, peso: 1, _id: 0 })
      .lean();
  }

  async getDistribucionCategorias(userId: string) {
    const result = await this.imcModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          categoria: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    return result;
  }
}

