import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { toast } from "sonner"

interface Tokens {
  accessToken: string
  refreshToken: string
}

export const useAuth = () => {
  const [tokens, setTokens] = useState<Tokens | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACK_URL}/auth/login`, {
        email,
        password,
      })
      setTokens(data)
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      navigate("/calculadora")
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || "Error en login")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (usuario: string, email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      await axios.post(`${import.meta.env.VITE_BACK_URL}/auth/register`, { usuario, email, password })
      toast.success('Usuario registrado correctamente')
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || "Error en registro")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setTokens(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/")
  }

  return {
    tokens,
    loading,
    error,
    setError,
    login,
    register,
    logout,
  }
}

