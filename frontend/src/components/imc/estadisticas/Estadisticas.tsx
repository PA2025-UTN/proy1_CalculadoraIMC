import axios from "axios"
import { useState, useEffect } from "react"
import Data from "./components/Data"
import { useEstadisticas } from "./hooks/useEstadisticas"

const ImcEstadisticas = () => {
  const token = localStorage.getItem("accessToken")
  const [usuario, setUsuario] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const { resumen } = useEstadisticas()

  useEffect(() => {
    const getNombreUsuario = async () => {
      setLoading(true)
      if (!token) return

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACK_URL}/auth/me`, {
          headers: {
            Authorization: token,
          },
        })
        setUsuario(response.data.usuario)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    getNombreUsuario()
  }, [token])

  if (loading) return null

  return (
    <div className="w-[60vw] space-y-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold">Hola, {usuario}</h1>
        <h2 className="text-primary/60">
          Últimos datos registrados:
          <span className="text-primary"> IMC: <strong>{resumen?.imcUltimo}</strong></span> -
          <span className="text-primary"> peso: <strong>{resumen?.pesoUltimo}</strong> kg</span> -
          <span className="text-primary"> altura: <strong>{resumen?.alturaUltimo}</strong> m</span>
          <span className="text-primary"> ({resumen?.fechaUltimo})</span>
        </h2>
      </div>
      <Data />
    </div>
  )
}

export default ImcEstadisticas
