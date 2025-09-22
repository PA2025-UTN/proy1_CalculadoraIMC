import { Injectable } from "@nestjs/common";
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { IImcRepository } from "./imc.repository.interface";
import { Imc } from "../entities/imc.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HistorialQueryDto } from "../dto/historial-query-dto";

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

  async findHistorial(userId: number, filtros: HistorialQueryDto): Promise<Imc[]> {
    const where: any = { user: { id: userId } };

    // Filtro por fechas
    if (filtros.from && filtros.to) {
      where.fecha = Between(new Date(filtros.from), new Date(filtros.to));
    } else if (filtros.from) {
      where.fecha = MoreThanOrEqual(new Date(filtros.from));
    } else if (filtros.to) {
      where.fecha = LessThanOrEqual(new Date(filtros.to));
    }

    // Filtro por categoría
    if (filtros.categoria && !filtros.categoria.includes("all")) {
      const dbMap: Record<string, string> = {
        bajo: "Bajo peso",
        normal: "Peso normal",
        sobrepeso: "Sobrepeso",
        obesidad: "Obesidad",
      };

      const categoriasDb = filtros.categoria
        .map(c => dbMap[c] ?? c)
        .filter(Boolean);

      where.categoria = categoriasDb.length > 1 ? In(categoriasDb) : categoriasDb[0];
    }

    // Orden
    const order: any = {};
    if (filtros.orderBy) {
      order[filtros.orderBy] = filtros.direction?.toUpperCase() || "DESC";
    } else {
      order.fecha = "DESC";
    }

    return this.repository.find({ where, order });
  }

  create(imc: Partial<Imc>): Imc {
    return this.repository.create(imc);
  }
}

