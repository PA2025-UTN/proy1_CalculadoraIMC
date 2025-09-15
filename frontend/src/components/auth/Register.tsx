import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFormValues, registerSchema } from "./utils/registerSchema"
import { useAuth } from "./hooks/useAuth"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Eye, EyeOff, TriangleAlert } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Toaster } from "sonner"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser, loading, error } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      usuario: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    registerUser(values.usuario, values.email, values.password)
    form.reset()
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" className="cursor-pointer bg-slate-200 hover:bg-slate-200/70">Registrarse</Button>
      </DialogTrigger>
      <DialogContent>
        <Toaster position="bottom-center" richColors />
        <DialogHeader>
          <DialogTitle>Registrar usuario</DialogTitle>
          <DialogDescription>Ingresá usuario, email y contraseña</DialogDescription>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ejemplo@gmail.com"
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        onChange={e => field.onChange(e.target.value)}
                        className={cn(
                          fieldState.invalid &&
                          "border-destructive ring-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
                        )}
                      />
                      <Button
                        className="cursor-pointer"
                        onClick={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Card className="p-2 pl-0 border-none shadow-none bg-red-100 mt-4">
                <CardContent>
                  <div className="flex gap-2 items-center">
                    <TriangleAlert className="text-red-500" size={20} />
                    <p className="text-red-500 whitespace-pre-line">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button className="cursor-pointer" variant="secondary" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Register
