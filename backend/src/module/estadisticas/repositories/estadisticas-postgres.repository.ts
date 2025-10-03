import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Imc } from "../../imc/entities/imc.entity";
import { IEstadisticasRepository } from "./estadisticas.repository.interface";

@Injectable()
export class EstadisticasPostgresRepository implements IEstadisticasRepository {
  constructor(
    @InjectRepository(Imc)
    private readonly repository: Repository<Imc>,
  ) { }

  async getResumen(userId: number) {
    const ultimoRegistro = await this.repository.findOne({
      where: { user: { id: userId } },
      order: { fecha: "DESC" },
      select: ["id", "imc", "peso", "altura", "fecha"],
    });

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
      ])
      .where("imc.userId = :userId", { userId });

    const resumen = await qb.getRawOne();

    return {
      ...resumen,
      imc_ultimo: ultimoRegistro?.imc || null,
      peso_ultimo: ultimoRegistro?.peso || null,
      altura_ultimo: ultimoRegistro?.altura || null,
      fecha_ultimo: ultimoRegistro?.fecha || null,
    };
  }

  async getSerieIMC(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { fecha: "ASC" },
      select: ["id", "fecha", "imc"],
    });
  }

  async getSeriePeso(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { fecha: "ASC" },
      select: ["id", "fecha", "peso"],
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

