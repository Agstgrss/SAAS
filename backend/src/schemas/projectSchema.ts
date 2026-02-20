import { z } from 'zod'

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome do projeto é obrigatório" })
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
    description: z
      .string()
      .optional(),
    tenantId: z
      .string({ message: "O tenant é obrigatório" })
      .min(1, { message: "O tenant é obrigatório" }),
  }),
});
