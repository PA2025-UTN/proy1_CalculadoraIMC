import { Imc } from "../entities/imc.entity";
import { HistorialQueryDto } from "../dto/historial-query-dto";

export interface IImcRepository {
  save(imc: Imc): Promise<Imc>;
  findByUserId(userId: number): Promise<Imc[]>;
  findHistorial(userId: number, filtros: HistorialQueryDto): Promise<Imc[]>;
  create(imc: Partial<Imc>): Imc;
}
