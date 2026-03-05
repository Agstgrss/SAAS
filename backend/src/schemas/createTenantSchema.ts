import { z } from "zod";

export const createTenantSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Nome é obrigatório" })
      .min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  }),
});
