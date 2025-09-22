import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DatePickerProps {
  value?: DateRange
  onChange?: (value?: DateRange) => void
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button" variant="outline" className="w-[240px] cursor-pointer font-normal flex justify-start">
          <CalendarIcon />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "MMM dd, yyyy", { locale: es })} –{" "}
                {format(value.to, "MMM dd, yyyy", { locale: es })}
              </>
            ) : (
              format(value.from, "MMM dd, yyyy", { locale: es })
            )
          ) : (
            <span>Elegí una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value || undefined}
          onSelect={onChange}
          numberOfMonths={2}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}

