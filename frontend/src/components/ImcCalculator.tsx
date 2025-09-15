import { Calculator } from "lucide-react"
import ImcCategorias from "./imc/ImcCategorias"
import ImcForm from "./imc/ImcForm"
import Header from "./Header"
import ImcHistorial from "./imc/ImcHistorial"

const ImcCalculator = () => {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center bg-slate-100">
        <Header />
        <div className="mt-12">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Calculator size={36} />
            </div>
            <h1 className="font-bold text-3xl">Calculadora IMC</h1>
          </div>
          <div className="flex flex-col gap-4 my-4">
            <ImcForm />
            <ImcCategorias />
            <ImcHistorial />
          </div>
        </div>
      </div>
    </>
  )
}

export default ImcCalculator
