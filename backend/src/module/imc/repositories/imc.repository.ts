import { Injectable } from "@nestjs/common";
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { IImcRepository } from "./imc.repository.interface";
import { Imc } from "../entities/imc.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HistorialQueryDto } from "../dto/historial-query-dto";
import { ImcModel } from "../models/imc.model";
import { ImcMapper } from "../mapper/imc.mapper";

@Injectable()
export class ImcPostgresRepository implements IImcRepository {
  constructor(
    @InjectRepository(Imc)
    private readonly repository: Repository<Imc>,
  ) { }

  async save(imc: ImcModel): Promise<ImcModel> {
    const entity = ImcMapper.toEntity(imc);
    const saved: Imc = await this.repository.save(entity);
    return ImcMapper.toModel(saved);
  }

  async findByUserId(userId: string): Promise<ImcModel[]> {
    const entities = await this.repository.find({
      where: { user: { id: Number(userId) } },
      order: { fecha: 'DESC' },
    });
    return entities.map(ImcMapper.toModel);
  }

  async findHistorial(userId: string, filtros: HistorialQueryDto): Promise<ImcModel[]> {
    const where: any = { user: { id: Number(userId) } };

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

    const results = await this.repository.find({ where, order, relations: { user: true } });

    return results.map(ImcMapper.toModel);
  }

  create(imc: Partial<ImcModel>): ImcModel {
    return {
      ...imc,
      fecha: imc.fecha ?? new Date(),
    } as ImcModel;
  }
}

