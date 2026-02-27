import { z } from 'zod'

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "O título da tarefa é obrigatório" })
      .min(3, { message: "O título deve ter no mínimo 3 caracteres" }),
    description: z
      .string()
      .optional(),
    projectId: z
      .string({ message: "O projeto é obrigatório" })
      .min(1, { message: "O projeto é obrigatório" }),
    status: z
      .enum(["TODO", "DOING", "DONE"])
      .optional(),
    assignedToId: z
      .string()
      .optional(),
    dueDate: z
      .string()
      .datetime()
      .optional(),
  }),
});
