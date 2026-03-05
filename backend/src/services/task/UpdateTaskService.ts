import prismaClient from "../../prisma";

interface UpdateTaskProps {
  userId: string;
  taskId: string;
  status?: "TODO" | "DOING" | "DONE";
  title?: string;
  description?: string;
  dueDate?: string;
}

class UpdateTaskService {
  async execute({
    userId,
    taskId,
    status,
    title,
    description,
    dueDate,
  }: UpdateTaskProps) {
    // 🔹 Buscar usuário
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // 🔹 Buscar task garantindo tenant
    const task = await prismaClient.task.findFirst({
      where: {
        id: taskId,
        tenantId: user.tenantId,
      },
    });

    if (!task) {
      throw new Error("Tarefa não encontrada");
    }

    const updatedTask = await prismaClient.task.update({
      where: { id: taskId },
      data: {
        status,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    return updatedTask;
  }
}

export { UpdateTaskService };