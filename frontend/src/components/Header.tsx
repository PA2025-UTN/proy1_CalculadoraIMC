import UtnLogo from "@/assets/utn-logo.png"
import { Button } from "./ui/button"
import { useAuth } from "./auth/hooks/useAuth"
import axios from "axios"
import { useEffect, useState } from "react"

const Header = () => {
  const token = localStorage.getItem("accessToken")
  const { logout } = useAuth()
  const [usuario, setUsuario] = useState<string>("")

  useEffect(() => {
    const getNombreUsuario = async () => {
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
      }
    }

    getNombreUsuario()
  }, [token])

  return (
    <div className="sticky w-full bg-slate-200 px-4">
      <div className={`flex ${token ? "justify-between" : "justify-start"} items-center`}>
        <img src={UtnLogo} alt="UTN Logo" className="h-16" />
        {token && (
          <div className="flex flex-row items-center gap-4">
            <p className="font-bold">{usuario}</p>
            <Button variant="destructive" className="cursor-pointer" onClick={logout}>Cerrar Sesión</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
