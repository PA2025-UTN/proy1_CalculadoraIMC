import { Controller } from "react-hook-form";
import DatePicker from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";

type Props = {
  control: any;
};

export function FechaField({ control }: Props) {
  return (
    <Controller
      control={control}
      name="fecha"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <Label>Fecha (desde - hasta)</Label>
          <DatePicker value={field.value} onChange={field.onChange} />
        </div>
      )}
    />
  );
}

