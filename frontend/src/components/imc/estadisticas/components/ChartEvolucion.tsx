import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import DatePicker from "@/components/ui/date-range-picker"
import { useMemo, useState } from "react"
import { useEstadisticas } from "../hooks/useEstadisticas"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Activity } from "lucide-react"
import { DateRange } from "react-day-picker"

const chartConfig = {
  peso: {
    label: "Peso (kg)",
    color: "var(--chart-1)",
  },
  imc: {
    label: "IMC",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const ChartEvolucion = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    // Inicializar con los últimos 90 días por defecto
    const today = new Date()
    const from = new Date()
    from.setDate(today.getDate() - 90)
    return { from, to: today }
  })
  const { serieIMC, seriePeso } = useEstadisticas()

  const chartData = useMemo(() => {
    if (!serieIMC.length || !seriePeso.length) return []

    return seriePeso.map((p) => {
      const match = serieIMC.find((i) => i.fecha === p.fecha)
      return {
        date: p.fecha,
        peso: p.peso,
        imc: match ? match.imc : null,
      }
    })
  }, [serieIMC, seriePeso])

  const { filteredData, startDateStr, endDateStr } = useMemo(() => {
    if (!chartData.length) return { filteredData: [], startDateStr: "-", endDateStr: "-" }

    let filtered = chartData

    // Filtrar por rango de fechas si están definidas
    if (dateRange?.from) {
      const startDate = new Date(dateRange.from)
      startDate.setHours(0, 0, 0, 0)

      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)

        filtered = chartData.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate >= startDate && itemDate <= endDate
        })
      } else {
        filtered = chartData.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate >= startDate
        })
      }
    }

    // Calcular rango visible
    let startStr = "-"
    let endStr = "-"
    if (filtered.length) {
      const sorted = [...filtered].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      startStr = new Date(sorted[0].date).toLocaleDateString("es-AR", {
        timeZone: "America/Belize",
        day: "numeric",
        month: "short",
      })
      endStr = new Date(sorted[sorted.length - 1].date).toLocaleDateString("es-AR", {
        timeZone: "America/Belize",
        day: "numeric",
        month: "short",
      })
    }

    return { filteredData: filtered, startDateStr: startStr, endDateStr: endStr }
  }, [chartData, dateRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex gap-2 items-center">
            <Activity size={18} className="text-blue-500" />
            Evolución del IMC y Peso
          </CardTitle>
          <CardDescription>
            Cambios registrados en los últimos meses
          </CardDescription>
        </div>
        <div className="flex flex-col items-center gap-1">
          <DatePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPeso" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-peso)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-peso)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillImc" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-imc)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-imc)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-AR", {
                  timeZone: "America/Belize",
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("es-AR", {
                      timeZone: "America/Belize",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="peso"
              type="monotone"
              fill="url(#fillPeso)"
              stroke="var(--color-peso)"
            />
            <Area
              dataKey="imc"
              type="monotone"
              fill="url(#fillImc)"
              stroke="var(--color-imc)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ChartEvolucion
