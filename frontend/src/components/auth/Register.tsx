import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import RegisterForm from "./components/RegisterForm"
import { Toaster } from "sonner"

const Register = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="cursor-pointer bg-slate-200 hover:bg-slate-200/70"
        >
          Registrarse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Toaster position="bottom-center" richColors />
        <DialogHeader>
          <DialogTitle>Registrar usuario</DialogTitle>
          <DialogDescription>
            Ingresá usuario, email y contraseña
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <RegisterForm open={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default Register

