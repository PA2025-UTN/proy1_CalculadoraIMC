import { DateRange } from "react-day-picker";

export type Categoria = "bajo" | "normal" | "sobrepeso" | "obesidad";

export type FiltrosForm = {
  fecha?: DateRange;
  categorias: Categoria[] | "all";
  orden?: "fecha-asc" | "fecha-desc" | "imc-asc" | "imc-desc";
};

export const categoriasDisponibles: { label: string; value: Categoria }[] = [
  { label: "Bajo peso", value: "bajo" },
  { label: "Peso normal", value: "normal" },
  { label: "Sobrepeso", value: "sobrepeso" },
  { label: "Obesidad", value: "obesidad" },
];

