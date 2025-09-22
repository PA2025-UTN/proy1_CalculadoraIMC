import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  control: any;
};

export function OrdenField({ control }: Props) {
  return (
    <Controller
      control={control}
      name="orden"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <Label>Ordenar por</Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-52 cursor-pointer bg-white hover:bg-neutral-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fecha-desc">Fecha (más reciente)</SelectItem>
                <SelectItem value="fecha-asc">Fecha (más antiguo)</SelectItem>
                <SelectItem value="imc-desc">IMC (más alto)</SelectItem>
                <SelectItem value="imc-asc">IMC (más bajo)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
}

