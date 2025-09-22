import { useState } from "react"
import axios from "axios"

export interface ImcResult {
  imc: number
  categoria: string
}

export const useCalculator = () => {
  const [resultado, setResultado] = useState<ImcResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const calcularImc = async (altura: number, peso: number) => {
    if (altura <= 0 || peso <= 0) {
      setError("Por favor, ingresa valores válidos (positivos).")
      setResultado(null)
      return
    }

    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("accessToken")

      const response = await axios.post(`${import.meta.env.VITE_BACK_URL}/imc/calcular`,
        { altura, peso },
        {
          headers: {
            Authorization: token
          }
        }
      )
      setResultado(response.data)
    } catch (err: any) {
      setError("Error al calcular el IMC. Verifica si el backend está corriendo.");
      setResultado(null);
    } finally {
      setLoading(false)
    }
  }

  return { resultado, error, loading, calcularImc }
}

