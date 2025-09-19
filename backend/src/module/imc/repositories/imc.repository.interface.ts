import { Imc } from "../entities/imc.entity";

export interface IImcRepository {
  save(imc: Imc): Promise<Imc>;
  findByUserId(userId: number): Promise<Imc[]>;
}
