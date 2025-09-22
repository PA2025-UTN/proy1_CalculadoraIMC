import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, CheckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Categoria, categoriasDisponibles } from "../types/filters-types";

type Props = {
  control: any;
};

export function CategoriasField({ control }: Props) {
  return (
    <Controller
      control={control}
      name="categorias"
      render={({ field }) => {
        const value = field.value === "all" ? [] : field.value || [];

        const toggleCategoria = (categoria: Categoria) => {
          if (field.value === "all") {
            field.onChange([categoria]);
          } else {
            if (value.includes(categoria)) {
              const newValues = value.filter((c: Categoria) => c !== categoria);
              field.onChange(newValues.length === 0 ? "all" : newValues);
            } else {
              field.onChange([...value, categoria]);
            }
          }
        };

        const handleAll = () => field.onChange("all");

        return (
          <div className="flex flex-col gap-2">
            <Label>Categorías</Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className="w-52 justify-between cursor-pointer font-normal"
                >
                  <span className="truncate max-w-[90%]">
                    {field.value === "all"
                      ? "Todas las categorías"
                      : value.map((v: Categoria) => categoriasDisponibles.find(c => c.value === v)?.label).join(", ")}
                  </span>
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-1 flex flex-col">
                <div
                  className="py-1.5 px-2 rounded-sm flex items-center justify-between hover:bg-neutral-100"
                  onClick={handleAll}
                >
                  <span className="text-sm">Todas las categorías</span>
                  {field.value === "all" && <CheckIcon className="size-4 opacity-60" />}
                </div>
                {categoriasDisponibles.map(cat => (
                  <div
                    key={cat.value}
                    className="py-1.5 px-2 rounded-sm flex items-center justify-between hover:bg-neutral-100"
                    onClick={() => toggleCategoria(cat.value)}
                  >
                    <span className="text-sm">{cat.label}</span>
                    {Array.isArray(field.value) &&
                      field.value.includes(cat.value) && (
                        <CheckIcon className="size-4 opacity-60" />
                      )}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        );
      }}
    />
  );
}

