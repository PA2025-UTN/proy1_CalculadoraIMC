import { NavLink } from "react-router"
import { Button } from "./ui/button"

const Navbar = () => {
  return (
    <div className="flex gap-4">
      <NavLink to="/calculadora">
        {({ isActive }) => (
          <Button variant={isActive ? "default" : "outline"} className="cursor-pointer">Calculadora</Button>
        )}
      </NavLink>
      <NavLink to="/historial">
        {({ isActive }) => (
          <Button variant={isActive ? "default" : "outline"} className="cursor-pointer">Historial</Button>
        )}
      </NavLink>
      <NavLink to="/estadisticas">
        {({ isActive }) => (
          <Button variant={isActive ? "default" : "outline"} className="cursor-pointer">Estadísticas</Button>
        )}
      </NavLink>
    </div>
  )
}

export default Navbar
