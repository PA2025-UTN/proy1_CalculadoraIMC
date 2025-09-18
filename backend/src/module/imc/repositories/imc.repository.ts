import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Imc } from "../entities/imc.entity";
import { IImcRepository } from "./imc.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ImcRepository implements IImcRepository {
  constructor(
    @InjectRepository(Imc)
    private readonly repository: Repository<Imc>
  ) { }

  async save(imc: Imc): Promise<Imc> {
    return this.repository.save(imc);
  }

  async findByUserId(userId: number): Promise<Imc[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { fecha: 'DESC' },
    });
  }
}
