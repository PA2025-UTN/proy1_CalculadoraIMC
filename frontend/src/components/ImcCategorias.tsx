import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const Categorias = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Categorías del IMC</CardTitle>
          <CardDescription>Rangos de índice de masa corporal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-neutral-100">
              <div className="font-semibold text-neutral-600">Bajo peso</div>
              <div className="text-sm text-muted-foreground">{`IMC < 18.5`}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-100">
              <div className="font-semibold text-green-600">Peso normal</div>
              <div className="text-sm text-muted-foreground">{`18.5 ≤ IMC < 25`}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-100">
              <div className="font-semibold text-amber-500">Sobrepeso</div>
              <div className="text-sm text-muted-foreground">{`25 ≤ IMC < 30`}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-100">
              <div className="font-semibold text-red-500">Obesidad</div>
              <div className="text-sm text-muted-foreground">{`IMC ≥ 30`}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Categorias
