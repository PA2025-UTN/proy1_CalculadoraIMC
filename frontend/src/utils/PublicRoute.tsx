import { Navigate, Outlet } from "react-router"
import { useIsAuth } from "@/components/auth/hooks/useIsAuth"
import Spinner from "@/components/ui/spinner"

const PublicRoute = () => {
  const isAuth = useIsAuth()

  if (isAuth === null) return <div className="h-screen w-full flex items-center justify-center"><Spinner /></div>

  return isAuth ? <Navigate to="/calculadora" /> : <Outlet />
}

export default PublicRoute
