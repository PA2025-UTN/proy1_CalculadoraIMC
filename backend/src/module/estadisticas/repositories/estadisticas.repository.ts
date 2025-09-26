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
        "AVG(imc.imc) as promedio",
        "MIN(imc.imc) as minimo",
        "MAX(imc.imc) as maximo",
        "COUNT(imc.id) as total",
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

