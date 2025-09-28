import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEstadisticas } from "../hooks/useEstadisticas";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, Calculator } from "lucide-react";

const Data = () => {
  const { resumen, loading, error } = useEstadisticas();

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardDescription>Total de Cálculos:</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">{resumen?.total}</CardTitle>
          <CardAction className="p-2 bg-slate-50 border-slate-100 border rounded-sm">
            <Calculator size={18} />
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>IMC Promedio:</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">{resumen?.imcPromedio}</CardTitle>
          <CardAction className="flex flex-col gap-1">
            <Badge variant="outline">
              <ArrowUpIcon />
              {resumen?.imcMaximo}
            </Badge>
            <Badge variant="outline">
              <ArrowDownIcon />
              {resumen?.imcMinimo}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Peso Promedio:</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {resumen?.pesoPromedio} kg
          </CardTitle>
          <CardAction className="flex flex-col gap-1">
            <Badge variant="outline">
              <ArrowUpIcon />
              {resumen?.pesoMaximo} kg
            </Badge>
            <Badge variant="outline">
              <ArrowDownIcon />
              {resumen?.pesoMinimo} kg
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Altura Promedio:</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {resumen?.alturaPromedio} m
          </CardTitle>
          <CardAction className="flex flex-col gap-1">
            <Badge variant="outline">
              <ArrowUpIcon />
              {resumen?.alturaMaximo} m
            </Badge>
            <Badge variant="outline">
              <ArrowDownIcon />
              {resumen?.alturaMinimo} m
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}

export default Data
