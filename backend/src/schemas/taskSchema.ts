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
      .string({ message: "A data de vencimento é obrigatória" })
      .datetime({ message: "A data de vencimento deve estar no formato ISO 8601 (ex: 2026-03-05T00:00:00Z)" })
      .refine((dateString) => {
        const dueDateObj = new Date(dateString);
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        return dueDateObj >= todayUTC;
      }, {
        message: "A data de vencimento não pode ser menor que hoje"
      })
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "O título da tarefa é obrigatório" })
      .min(3, { message: "O título deve ter no mínimo 3 caracteres" })
      .optional(),
    description: z
      .string()
      .optional(),
    status: z
      .enum(["TODO", "DOING", "DONE"])
      .optional(),
    assignedToId: z
      .string()
      .optional(),
    dueDate: z
      .string({ message: "A data de vencimento deve estar no formato ISO 8601" })
      .datetime({ message: "A data de vencimento deve estar no formato ISO 8601 (ex: 2026-03-05T00:00:00Z)" })
      .refine((dateString) => {
        const dueDateObj = new Date(dateString);
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        return dueDateObj >= todayUTC;
      }, {
        message: "A data de vencimento não pode ser menor que hoje"
      })
      .optional()
  }),
  params: z.object({
    id: z.string()
  })
});
