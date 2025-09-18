import { Navigate, Outlet } from "react-router"
import { useEffect, useState } from "react"
import axios from "axios"

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken")
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setIsAuth(false)
      return
    }

    const validate = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACK_URL}/auth/me`,
          {
            headers: { Authorization: token },
          }
        )
        setIsAuth(res.status === 200)
      } catch {
        setIsAuth(false)
      }
    }

    validate()
  }, [token])

  return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute

