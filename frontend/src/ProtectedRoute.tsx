import { Navigate } from "react-router"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken")

  if (!token) {
    // si no hay token -> redirige al home o login
    return <Navigate to="/" replace />
  }

  // si hay token -> muestra la página protegida
  return <>{children}</>
}

export default ProtectedRoute
