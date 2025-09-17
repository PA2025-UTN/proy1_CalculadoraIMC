import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormValues, loginSchema } from "./utils/loginSchema"
import { useAuth } from "./hooks/useAuth"
import { Card, CardContent } from "../ui/card"
import { Eye, EyeOff, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, setError } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    login(values.email, values.password)
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset()
          setError(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Iniciar Sesión</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar Sesión</DialogTitle>
          <DialogDescription>Ingresá con tu email y contraseña</DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
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
                        {...field}
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
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Login
