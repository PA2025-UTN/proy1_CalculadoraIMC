import { FiltrosForm } from "../types/filters-types";

export function useHistorialQuery() {
  const buildQuery = (data: FiltrosForm) => {
    const params = new URLSearchParams();

    if (data.fecha?.from) {
      params.append("from", data.fecha.from.toISOString().split("T")[0]);
    }
    if (data.fecha?.to) {
      params.append("to", data.fecha.to.toISOString().split("T")[0]);
    }

    if (data.orden) {
      const [campo, direccion] = data.orden.split("-");
      params.append("orderBy", campo);
      params.append("direction", direccion);
    }

    if (Array.isArray(data.categorias) && data.categorias.length > 0) {
      params.append("categoria", data.categorias.join(","));
    } else if (data.categorias === "all") {
      params.append("categoria", "all");
    }

    return `/imc/historial?${params.toString()}`;
  };

  return { buildQuery };
}

