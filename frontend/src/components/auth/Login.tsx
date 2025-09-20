import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import LoginForm from "./components/LoginForm"
import { useState } from "react"

const Login = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size="lg">Iniciar Sesión</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar Sesión</DialogTitle>
          <DialogDescription>Ingresá con tu email y contraseña</DialogDescription>
        </DialogHeader>
        <Separator />
        <LoginForm open={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default Login
