import { ImcInput } from "./Input"
import { ImcResultado } from "./Resultado"
import { ImcFormValues } from "./utils/imcSchema"
import { useCalculator } from "./hooks/useCalculator"
import { ErrorCard } from "../ErrorCard"

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

      {error && <ErrorCard message={error} />}
    </div>
  )
}

export default ImcForm

