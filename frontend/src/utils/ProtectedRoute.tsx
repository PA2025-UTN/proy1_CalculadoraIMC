import { Navigate, Outlet } from "react-router"
import { useIsAuth } from "@/components/auth/hooks/useIsAuth"

const ProtectedRoute = () => {
  const isAuth = useIsAuth()

  if (isAuth === null) return <div className="h-screen w-full p-4">Cargando...</div>


  return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute

