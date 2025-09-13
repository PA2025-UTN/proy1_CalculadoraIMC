import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ImcFormValues, imcSchema } from "@/lib/imcSchema"

interface ImcInputProps {
  onSubmit: (values: ImcFormValues) => void
  loading: boolean
}

export function ImcInput({ onSubmit, loading }: ImcInputProps) {
  const form = useForm<ImcFormValues>({
    resolver: zodResolver(imcSchema),
    defaultValues: {
      altura: undefined,
      peso: undefined,
    },
  })

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Introduce tus datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="altura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura (m)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      step="0.01"
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      step="0.01"
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? "Calculando..." : "Calcular"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

