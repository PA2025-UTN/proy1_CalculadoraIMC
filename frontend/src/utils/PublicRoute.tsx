import { Navigate, Outlet } from "react-router"
import { useIsAuth } from "@/components/auth/hooks/useIsAuth"
import Spinner from "@/components/ui/spinner"

const PublicRoute = () => {
  const isAuth = useIsAuth()

  if (isAuth === null) return (
    <div className="h-screen w-full flex flex-col gap-2 items-center justify-center">
      <Spinner />
      <p>Conectando con el servidor...</p>
    </div>
  )

  return isAuth ? <Navigate to="/calculadora" /> : <Outlet />
}

export default PublicRoute
