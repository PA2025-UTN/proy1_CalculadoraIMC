import { ImcModel } from "../models/imc.model";
import { HistorialQueryDto } from "../dto/historial-query-dto";

export interface IImcRepository {
  save(imc: ImcModel): Promise<ImcModel>;
  findByUserId(userId: string): Promise<ImcModel[]>;
  findHistorial(userId: string, filtros: HistorialQueryDto): Promise<ImcModel[]>;
  create(imc: Partial<ImcModel>): ImcModel;
}
