import { z } from "zod";

export const registerSchema = z.object({
  usuario: z
    .string({ error: "El usuario es obligatorio" })
    .min(1, "El usuario es obligatorio"),
  email: z
    .string({ error: "El email es obligatorio" })
    .min(1, "El email es obligatorio")
    .email("El email no es válido"),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
