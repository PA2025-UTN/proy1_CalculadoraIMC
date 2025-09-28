// Resumen de estadísticas
export interface ResumenEstadisticas {
  imcPromedio: number;
  imcMinimo: number;
  imcMaximo: number;
  pesoPromedio: number;
  pesoMinimo: number;
  pesoMaximo: number;
  alturaPromedio: number;
  alturaMinimo: number;
  alturaMaximo: number;
  imcUltimo: number;
  pesoUltimo: number;
  alturaUltimo: number;
  total: number;
}

// Serie temporal IMC
export interface SerieIMC {
  fecha: string;
  imc: number;
}

// Serie temporal Peso
export interface SeriePeso {
  fecha: string;
  peso: number;
}

// Distribución por categorías
export interface DistribucionCategoria {
  categoria: string;
  count: number;
}

