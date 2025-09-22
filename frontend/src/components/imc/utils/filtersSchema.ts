import { z } from "zod";

export const filtersSchema = z.object({
  fecha: z.union([
    z.undefined(),
    z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
  ]),
  categoria: z.array(z.string()).optional(),
  ordenFecha: z.union([
    z.undefined(),
    z.literal("asc"),
    z.literal("desc")
  ]).default("desc"),
  ordenImc: z.union([
    z.undefined(),
    z.literal("asc"),
    z.literal("desc")
  ]),
});

export type FiltersFormValues = z.infer<typeof filtersSchema>;
