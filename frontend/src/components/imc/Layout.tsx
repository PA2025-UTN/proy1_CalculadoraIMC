import { Outlet } from "react-router"
import Header from "../Header"

const ImcLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-slate-100">
      <Header />

      <div className="p-4 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default ImcLayout
