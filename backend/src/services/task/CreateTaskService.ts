import prismaClient from "../../prisma";

interface CreateTaskProps {
  userId: string; // 🔥 agora vem do token
  title: string;
  description?: string;
  projectId: string;
  status?: "TODO" | "DOING" | "DONE";
  assignedToId?: string;
  dueDate?: string;
}

class CreateTaskService {
  async execute({
    userId,
    title,
    description,
    projectId,
    status = "TODO",
    assignedToId,
    dueDate,
  }: CreateTaskProps) {

    // 🔹 Buscar usuário autenticado
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    const tenantId = user.tenantId;

    // 🔹 Verificar se o projeto pertence ao tenant
    const projectExists = await prismaClient.project.findFirst({
      where: {
        id: projectId,
        tenantId: tenantId,
      },
    });

    if (!projectExists) {
      throw new Error("Projeto não encontrado no tenant!");
    }

    // 🔹 Verificar se o usuário atribuído existe (se fornecido)
    if (assignedToId) {
      const userExists = await prismaClient.user.findFirst({
        where: {
          id: assignedToId,
          tenantId: tenantId,
        },
      });

      if (!userExists) {
        throw new Error("Usuário atribuído não encontrado no tenant!");
      }
    }

    // 🔹 Criar tarefa
    const task = await prismaClient.task.create({
      data: {
        title,
        description: description || null,
        projectId,
        tenantId,
        status,
        assignedToId: assignedToId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        projectId: true,
        tenantId: true,
        status: true,
        assignedToId: true,
        dueDate: true,
        createdAt: true,
      },
    });

    return task;
  }
}

export { CreateTaskService };