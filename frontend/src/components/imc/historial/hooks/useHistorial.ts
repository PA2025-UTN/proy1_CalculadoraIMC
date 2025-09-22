import { useState, useCallback } from "react"
import axios from "axios"

interface Historial {
  id: number
  peso: number
  altura: number
  imc: number
  categoria: string
  fecha: string
}

export const useHistorial = () => {
  const token = localStorage.getItem("accessToken")
  const [data, setData] = useState<Historial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<string>("")

  const fetchHistorial = useCallback(
    async (query?: string) => {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const finalQuery = query !== undefined ? query : lastQuery
        const res = await axios.get<Historial[]>(
          `${import.meta.env.VITE_BACK_URL}/imc/historial${finalQuery}`,
          {
            headers: { Authorization: token },
          }
        )
        setData(res.data)
        if (query !== undefined) setLastQuery(query)
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al obtener historial")
      } finally {
        setLoading(false)
      }
    },
    [token, lastQuery]
  )

  return { data, loading, error, fetchHistorial }
}

