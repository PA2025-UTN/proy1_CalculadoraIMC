import { z } from "zod";

export const imcSchema = z.object({
  altura: z
    .number({ error: "Ingresá un valor" })
    .min(0.1, "La altura debe ser mayor a 0 m")
    .max(3, "La altura no puede ser mayor a 3 m"),
  peso: z
    .number({ error: "Ingresá un valor" })
    .min(1, "El peso debe ser mayor a 1 kg")
    .max(500, "El peso no puede superar los 500 kg"),
});

export type ImcFormValues = z.infer<typeof imcSchema>;
