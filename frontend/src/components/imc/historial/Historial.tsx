import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import axios from "axios"
import { Filter, History, RefreshCw } from "lucide-react"
import { Button } from "../../ui/button"
import { ScrollArea } from "../../ui/scroll-area"
import CardHistorial from "./components/CardHistorial"
import Filters from "./components/Filters"

interface Historial {
  id: number
  peso: number
  altura: number
  imc: number
  categoria: string
  fecha: string
}

const ImcHistorial = () => {
  const token = localStorage.getItem("accessToken")
  const [historial, setHistorial] = useState<Historial[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)


  const getHistorial = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<Historial[]>(`${import.meta.env.VITE_BACK_URL}/imc/historial`, {
        headers: {
          Authorization: token,
        },
      })
      setHistorial(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al obtener historial")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHistorial()
  }, [token])

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
              onClick={getHistorial}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {showFilters && <Filters />}
      </CardHeader>
      <CardContent>
        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {historial.length > 0 ? (
          <ScrollArea className={`${showFilters ? "h-[71vh]" : "h-[78vh]"} w-full`}>
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
