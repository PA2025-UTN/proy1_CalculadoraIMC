import { ImcMongo } from '../schemas/imc.schema';
import { ImcModel } from '../models/imc.model';

export class ImcMongoMapper {
  static toModel(doc: ImcMongo): ImcModel {
    return {
      id: (doc._id as any).toString(),
      userId: doc.userId,
      peso: doc.peso,
      altura: doc.altura,
      imc: doc.imc,
      categoria: doc.categoria,
      fecha: doc.fecha,
    };
  }

  static toDocument(model: ImcModel): Partial<ImcMongo> {
    return {
      userId: model.userId,
      peso: model.peso,
      altura: model.altura,
      imc: model.imc,
      categoria: model.categoria,
      fecha: model.fecha,
    };
  }
}

