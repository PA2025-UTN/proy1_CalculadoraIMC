import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BarChart3, ChartPie, History, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Badge } from "../ui/badge"

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

  const categoriaColors: Record<string, string> = {
    "Bajo peso": "bg-neutral-100 text-neutral-600",
    "Peso normal": "bg-green-100 text-green-600",
    "Sobrepeso": "bg-amber-100 text-amber-500",
    "Obesidad": "bg-red-100 text-red-500",
  }


  return (
    <Card className="p-0">
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2 cursor-pointer">
            <History className="w-4 h-4" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2 cursor-pointer">
            <BarChart3 className="w-4 h-4" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Historial de cálculos
                </CardTitle>
                {historial.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-muted-foreground hover:text-primary transition-all"
                    onClick={getHistorial}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading && <p>Cargando...</p>}
              {error && <p>{error}</p>}
              {historial.length > 0 ? (
                <ScrollArea className="h-80 w-full">
                  <div className="space-y-3">
                    {historial.map((imc) => (
                      <div key={imc.id} className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 font-bold">
                            <p className="text-lg">IMC: </p>
                            <div className="text-lg font-semibold text-primary">{imc.imc}</div>
                          </div>
                          <div className="text-sm">
                            {new Date(imc.fecha).toLocaleString("es-AR")}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Peso: {imc.peso}kg</span>
                            <span>Altura: {imc.altura}m</span>
                          </div>
                          <div>
                            <Badge className={`py-1 px-4 ${categoriaColors[imc.categoria] || ""}`}>
                              {imc.categoria}
                            </Badge>
                          </div>
                        </div>
                      </div>
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
        </TabsContent>

        <TabsContent value="statistics">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Estadísticas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 text-center">
                <ChartPie className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-primary/50 text-xl">Proximamente...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

export default ImcHistorial
