import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Filter, History, RefreshCw } from "lucide-react"
import { Button } from "../../ui/button"
import { ScrollArea } from "../../ui/scroll-area"
import CardHistorial from "./components/CardHistorial"
import Filters from "./components/Filters"
import { useHistorial } from "./hooks/useHistorial"
import Spinner from "@/components/ui/spinner"
import { ErrorCard } from "@/components/ErrorCard"

const ImcHistorial = () => {
  const { data: historial, loading, error, fetchHistorial } = useHistorial()
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchHistorial()
  }, [fetchHistorial])

  return (
    <Card className="w-[40vw]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Historial de cálculos
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-muted-foreground hover:text-primary transition-all"
              onClick={() => setShowFilters(prev => !prev)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-muted-foreground hover:text-primary transition-all"
              onClick={() => fetchHistorial()}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {showFilters && <Filters onSubmit={fetchHistorial} />}
      </CardHeader>
      <CardContent>
        {loading && <div className="w-full mb-2 flex justify-center"><Spinner size={25} /></div>}
        {error && <ErrorCard message={error} />}
        {historial.length > 0 ? (
          <ScrollArea className={`${showFilters ? "h-[65vh]" : "h-[78vh]"} w-full`}>
            <div className="space-y-3">
              {historial.map((imc, i) => (
                <CardHistorial
                  key={i}
                  imc={imc.imc}
                  peso={imc.peso}
                  altura={imc.altura}
                  categoria={imc.categoria}
                  fecha={imc.fecha}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay cálculos guardados todavía</p>
            <p className="text-sm text-primary/80">Los resultados aparecerán acá automáticamente</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ImcHistorial

