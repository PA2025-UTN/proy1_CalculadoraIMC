import { User } from "@/module/users/entities/user.entity";
import { Imc } from "../entities/imc.entity";
import { ImcModel } from "../models/imc.model";

export class ImcPostgresMapper {
  static toModel(entity: Imc): ImcModel {
    return {
      id: entity.id.toString(),
      peso: entity.peso,
      altura: entity.altura,
      imc: entity.imc,
      categoria: entity.categoria,
      fecha: entity.fecha,
      userId: entity.user.id.toString(),
    };
  }

  static toEntity(model: ImcModel): Imc {
    return {
      id: model.id ? Number(model.id) : undefined,
      peso: model.peso,
      altura: model.altura,
      imc: model.imc,
      categoria: model.categoria,
      fecha: model.fecha,
      user: { id: Number(model.userId) } as User,
    } as Imc;
  }
}
