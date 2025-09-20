import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "El email es obligatorio" })
    .min(1, "El email es obligatorio"),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
