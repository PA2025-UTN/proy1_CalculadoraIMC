import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImcMongo } from '../schemas/imc.schema';
import { IImcRepository } from './imc.repository.interface';
import { ImcModel } from '../models/imc.model';
import { HistorialQueryDto } from '../dto/historial-query-dto';

@Injectable()
export class ImcMongoRepository implements IImcRepository {
  constructor(
    @InjectModel(ImcMongo.name) private readonly imcModel: Model<ImcMongo>,
  ) { }

  async save(imc: ImcModel): Promise<ImcModel> {
    const created = new this.imcModel(imc);
    const saved = await created.save();
    return this.toModel(saved);
  }

  async findByUserId(userId: string): Promise<ImcModel[]> {
    const docs = await this.imcModel.find({ userId }).sort({ fecha: -1 }).exec();
    return docs.map(this.toModel);
  }

  async findHistorial(userId: string, filtros: HistorialQueryDto): Promise<ImcModel[]> {
    const query: any = { userId };

    // Fechas
    if (filtros.from && filtros.to) {
      query.fecha = { $gte: new Date(filtros.from), $lte: new Date(filtros.to) };
    } else if (filtros.from) {
      query.fecha = { $gte: new Date(filtros.from) };
    } else if (filtros.to) {
      query.fecha = { $lte: new Date(filtros.to) };
    }

    // Categorías
    if (filtros.categoria && !filtros.categoria.includes('all')) {
      const dbMap: Record<string, string> = {
        bajo: 'Bajo peso',
        normal: 'Peso normal',
        sobrepeso: 'Sobrepeso',
        obesidad: 'Obesidad',
      };
      const categoriasDb = filtros.categoria.map(c => dbMap[c] ?? c);
      query.categoria = { $in: categoriasDb };
    }

    // Orden
    const sort: any = {};
    if (filtros.orderBy) {
      sort[filtros.orderBy] = filtros.direction?.toLowerCase() === 'asc' ? 1 : -1;
    } else {
      sort.fecha = -1;
    }

    const docs = await this.imcModel.find(query).sort(sort).exec();
    return docs.map(this.toModel);
  }

  create(imc: Partial<ImcModel>): ImcModel {
    return imc as ImcModel;
  }

  private toModel = (doc: ImcMongo): ImcModel => ({
    id: (doc._id as any).toString(),
    userId: doc.userId,
    peso: doc.peso,
    altura: doc.altura,
    imc: doc.imc,
    categoria: doc.categoria,
    fecha: doc.fecha,
  });
}

