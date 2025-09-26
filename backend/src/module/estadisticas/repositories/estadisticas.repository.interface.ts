export interface IEstadisticasRepository {
  getResumen(userId: number): Promise<{
    promedio: string;
    minimo: string;
    maximo: string;
    total: string;
  }>;

  getSerieIMC(userId: number): Promise<
    { fecha: Date; imc: number }[]
  >;

  getSeriePeso(userId: number): Promise<
    { fecha: Date; peso: number }[]
  >;

  getDistribucionCategorias(userId: number): Promise<
    { categoria: string; count: string }[]
  >;
}

