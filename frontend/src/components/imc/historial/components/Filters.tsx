import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FechaField } from "./FechaField";
import { CategoriasField } from "./CategoriasField";
import { OrdenField } from "./OrdenField";
import { useHistorialQuery } from "../hooks/useHistorialQuery";
import { FiltrosForm } from "../types/filters-types";
import { CheckIcon } from "lucide-react";

export default function HistorialFilters() {
  const { control, handleSubmit, reset } = useForm<FiltrosForm>({
    defaultValues: {
      fecha: undefined,
      categorias: "all",
      orden: "fecha-desc",
    },
  });

  const { buildQuery } = useHistorialQuery();

  const onFormSubmit = (data: FiltrosForm) => {
    const query = buildQuery(data);
    console.log("GET:", query);
    // fetch acá
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-slate-50 flex-wrap"
    >
      <div className="flex justify-between w-full flex-wrap">
        <FechaField control={control} />
        <CategoriasField control={control} />
        <OrdenField control={control} />
      </div>

      <div className="flex w-full justify-end gap-2">
        <Button
          className="cursor-pointer"
          size="sm"
          type="button"
          variant="outline"
          onClick={() => reset()}
        >
          Limpiar filtros
        </Button>
        <Button
          className="cursor-pointer"
          size="sm"
          type="submit"
        >
          <CheckIcon />
        </Button>
      </div>
    </form>
  );
}
