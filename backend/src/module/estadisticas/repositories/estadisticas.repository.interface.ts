export interface IEstadisticasRepository {
  getResumen(userId: string | number): Promise<{
    imc_promedio: number;
    imc_minimo: number;
    imc_maximo: number;
    peso_promedio: number;
    peso_minimo: number;
    peso_maximo: number;
    altura_promedio: number;
    altura_minimo: number;
    altura_maximo: number;
    imc_ultimo: number;
    peso_ultimo: number;
    altura_ultimo: number;
    fecha_ultimo: Date;
    total: number;
  }>;

  getSerieIMC(userId: string | number): Promise<
    { fecha: Date; imc: number }[]
  >;

  getSeriePeso(userId: string | number): Promise<
    { fecha: Date; peso: number }[]
  >;

  getDistribucionCategorias(userId: string | number): Promise<
    { categoria: string; count: number }[]
  >;
}

