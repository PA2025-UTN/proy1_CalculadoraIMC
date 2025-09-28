import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Imc } from "../../imc/entities/imc.entity";
import { IEstadisticasRepository } from "./estadisticas.repository.interface";

@Injectable()
export class EstadisticasRepository implements IEstadisticasRepository {
  constructor(
    @InjectRepository(Imc)
    private readonly repository: Repository<Imc>,
  ) { }

  async getResumen(userId: number) {
    const qb = this.repository
      .createQueryBuilder("imc")
      .select([
        "AVG(imc.imc) as imc_promedio",
        "MIN(imc.imc) as imc_minimo",
        "MAX(imc.imc) as imc_maximo",
        "AVG(imc.peso) as peso_promedio",
        "MIN(imc.peso) as peso_minimo",
        "MAX(imc.peso) as peso_maximo",
        "AVG(imc.altura) as altura_promedio",
        "MIN(imc.altura) as altura_minimo",
        "MAX(imc.altura) as altura_maximo",
        "COUNT(imc.id) as total",
        `(SELECT i.imc
          FROM imc i
          WHERE i."userId" = :userId
          ORDER BY i.fecha DESC
          LIMIT 1) as imc_ultimo`,
        `(SELECT i.peso
          FROM imc i
          WHERE i."userId" = :userId
          ORDER BY i.fecha DESC
          LIMIT 1) as peso_ultimo`,
        `(SELECT i.altura
          FROM imc i
          WHERE i."userId" = :userId
          ORDER BY i.fecha DESC
          LIMIT 1) as altura_ultimo`,
        `(SELECT i.fecha
          FROM imc i
          WHERE i."userId" = :userId
          ORDER BY i.fecha DESC
          LIMIT 1) as fecha_ultimo`,
      ])
      .where("imc.userId = :userId", { userId });

    return qb.getRawOne();
  }

  async getSerieIMC(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { fecha: "ASC" },
      select: ["fecha", "imc"],
    });
  }

  async getSeriePeso(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { fecha: "ASC" },
      select: ["fecha", "peso"],
    });
  }

  async getDistribucionCategorias(userId: number) {
    const qb = this.repository
      .createQueryBuilder("imc")
      .select("imc.categoria", "categoria")
      .addSelect("COUNT(*)", "count")
      .where("imc.userId = :userId", { userId })
      .groupBy("imc.categoria");

    return qb.getRawMany();
  }
}

