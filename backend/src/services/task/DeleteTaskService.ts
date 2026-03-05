import prismaClient from "../../prisma";

interface DeleteTaskProps {
  userId: string;
  taskId: string;
}

class DeleteTaskService {
  async execute({ userId, taskId }: DeleteTaskProps) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const task = await prismaClient.task.findFirst({
      where: {
        id: taskId,
        tenantId: user.tenantId,
      },
    });

    if (!task) {
      throw new Error("Tarefa não encontrada");
    }

    await prismaClient.task.delete({
      where: { id: taskId },
    });

    return { message: "Tarefa deletada com sucesso" };
  }
}

export { DeleteTaskService };