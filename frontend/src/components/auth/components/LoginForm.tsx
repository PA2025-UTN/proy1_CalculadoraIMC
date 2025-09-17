import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../hooks/useAuth"
import { LoginFormValues, loginSchema } from "../utils/loginSchema"
import { PasswordField } from "./PasswordField"
import { ErrorCard } from "@/components/ErrorCard"

const LoginForm = ({ open }: { open?: () => void }) => {
  const { login, loading, error, setError } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.email, values.password)
    if (success) {
      form.reset()
      open?.()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="ejemplo@gmail.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordField
                  field={field}
                  invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error */}
        {error && (
          <ErrorCard message={error} />
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={() => {
              form.reset()
              setError(null)
              open?.()
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm

