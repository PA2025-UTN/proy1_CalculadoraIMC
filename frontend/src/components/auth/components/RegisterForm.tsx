import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFormValues, registerSchema } from "../utils/registerSchema"
import { useAuth } from "../hooks/useAuth"
import { PasswordField } from "./PasswordField"
import { ErrorCard } from "@/components/ErrorCard"

const RegisterForm = ({ open }: { open?: () => void }) => {
  const { register: registerUser, loading, error, setError } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      usuario: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const success = await registerUser(
      values.usuario,
      values.email,
      values.password
    )
    if (success) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Usuario */}
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ejemplo@gmail.com" {...field} />
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
                <PasswordField field={field} invalid={fieldState.invalid} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error */}
        {error && <ErrorCard message={error} />}

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
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm

