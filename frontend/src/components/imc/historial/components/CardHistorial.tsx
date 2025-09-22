import { Badge } from "@/components/ui/badge"

const categoriaColors: Record<string, string> = {
  "Bajo peso": "bg-neutral-100 text-neutral-600",
  "Peso normal": "bg-green-100 text-green-600",
  "Sobrepeso": "bg-amber-100 text-amber-500",
  "Obesidad": "bg-red-100 text-red-500",
}

interface HistorialProps {
  peso: number
  altura: number
  imc: number
  categoria: string
  fecha: string
}

const CardHistorial = ({ imc, peso, altura, categoria, fecha }: HistorialProps) => {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-slate-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold">
          <p className="text-lg">IMC: </p>
          <div className="text-lg font-semibold text-primary">{imc}</div>
        </div>
        <div className="text-md">
          {new Date(fecha).toLocaleString("es-AR")}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-md text-muted-foreground">
          <span>Peso: {peso}kg</span>
          <span>Altura: {altura}m</span>
        </div>
        <div>
          <Badge className={`text-md py-1 px-4 ${categoriaColors[categoria] || ""}`}>
            {categoria}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default CardHistorial
