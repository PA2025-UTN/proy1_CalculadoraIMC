import Login from "./auth/Login"
import Register from "./auth/Register"
import UtnLogo from "@/assets/utn-logo.png"

const Header = () => {
  return (
    <div className="bg-slate-200 px-4">
      <div className="flex justify-between items-center">
        <img src={UtnLogo} alt="UTN Logo" className="h-16" />
        <div className="flex gap-3">
          <Login />
          <Register />
        </div>
      </div>
    </div>
  )
}

export default Header
