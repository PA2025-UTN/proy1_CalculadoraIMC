import { useEffect, useState } from "react";
import {
  fetchResumen,
  fetchSerieIMC,
  fetchSeriePeso,
  fetchDistribucionCategorias,
} from "../services/estadisticas";
import {
  ResumenEstadisticas,
  SerieIMC,
  SeriePeso,
  DistribucionCategoria,
} from "../types/estadisticas";

interface UseEstadisticasState {
  resumen: ResumenEstadisticas | null;
  serieIMC: SerieIMC[];
  seriePeso: SeriePeso[];
  categorias: DistribucionCategoria[];
  loading: boolean;
  error: string | null;
}

export function useEstadisticas() {
  const [state, setState] = useState<UseEstadisticasState>({
    resumen: null,
    serieIMC: [],
    seriePeso: [],
    categorias: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [resumen, serieIMC, seriePeso, categorias] = await Promise.all([
          fetchResumen(),
          fetchSerieIMC(),
          fetchSeriePeso(),
          fetchDistribucionCategorias(),
        ]);

        setState({
          resumen,
          serieIMC,
          seriePeso,
          categorias,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message ?? "Error cargando estadísticas",
        }));
      }
    }

    load();
  }, []);

  return state;
}

