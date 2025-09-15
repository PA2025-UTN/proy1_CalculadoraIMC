import { Card, CardContent } from "@/components/ui/card"
import { ImcInput } from "./ImcInput"
import { ImcResultado } from "./ImcResultado"
import { TriangleAlert } from "lucide-react"
import { ImcFormValues } from "./utils/imcSchema"
import { useCalculator } from "./hooks/useCalculator"

function ImcForm() {
  const { resultado, error, loading, calcularImc } = useCalculator()

  const onSubmit = (data: ImcFormValues) => {
    calcularImc(data.altura, data.peso)
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <ImcInput onSubmit={onSubmit} loading={loading} />
        <ImcResultado resultado={resultado} />
      </div>

      {error && (
        <Card className="p-2 pl-0 border-none shadow-none bg-red-100 mt-4">
          <CardContent>
            <div className="flex gap-2 items-center">
              <TriangleAlert className="text-red-500" size={20} />
              <p className="text-red-500 whitespace-pre-line">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ImcForm

