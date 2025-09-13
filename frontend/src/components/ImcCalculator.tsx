import { Calculator } from "lucide-react"
import Categorias from "./imc/ImcCategorias"
import ImcForm from "./imc/ImcForm"

const ImcCalculator = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-neutral-100 p-4">
          <Calculator size={36} />
        </div>
        <h1 className="font-bold text-3xl">Calculadora IMC</h1>
      </div>
      <ImcForm />
      <Categorias />
    </div>
  )
}

export default ImcCalculator
