import { NavLink } from "react-router"
import { Button } from "./ui/button"

const rutas = [
  { path: "/calculadora", label: "Calculadora" },
  { path: "/historial", label: "Historial" },
  { path: "/estadisticas", label: "Estadísticas" },
]

const Navbar = () => {
  return (
    <div className="flex gap-4">
      {rutas.map(({ path, label }) => (
        <NavLink key={path} to={path}>
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer"
            >
              {label}
            </Button>
          )}
        </NavLink>
      ))}
    </div>
  )
}

export default Navbar

