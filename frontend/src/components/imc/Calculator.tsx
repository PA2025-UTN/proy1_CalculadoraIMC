import { Calculator } from "lucide-react"
import ImcForm from "./Form"
import ImcCategorias from "./Categorias"

const ImcCalculator = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Calculator size={36} />
        </div>
        <h1 className="font-bold text-3xl">Calculadora IMC</h1>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <ImcForm />
        <ImcCategorias />
      </div>
    </>
  )
}

export default ImcCalculator
