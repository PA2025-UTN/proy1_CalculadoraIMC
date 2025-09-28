export interface IEstadisticasRepository {
  getResumen(userId: number): Promise<{
    imc_promedio: string;
    imc_minimo: string;
    imc_maximo: string;
    peso_promedio: string;
    peso_minimo: string;
    peso_maximo: string;
    altura_promedio: string;
    altura_minimo: string;
    altura_maximo: string;
    imc_ultimo: string;
    peso_ultimo: string;
    altura_ultimo: string;
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

