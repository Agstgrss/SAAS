import prismaClient from "../../prisma";

interface CreateTaskProps {
  title: string;
  description?: string;
  projectId: string;
  tenantId: string;
  status?: "TODO" | "DOING" | "DONE";
  assignedToId?: string;
  dueDate?: string;
}

class CreateTaskService {
  async execute({
    title,
    description,
    projectId,
    tenantId,
    status = "TODO",
    assignedToId,
    dueDate,
  }: CreateTaskProps) {
    // Verificar se o tenant existe
    const tenantExists = await prismaClient.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenantExists) {
      throw new Error("Tenant não encontrado!");
    }

    // Verificar se o projeto existe e pertence ao tenant
    const projectExists = await prismaClient.project.findFirst({
      where: {
        id: projectId,
        tenantId: tenantId,
      },
    });

    if (!projectExists) {
      throw new Error("Projeto não encontrado no tenant!");
    }

    // Verificar se o usuário atribuído existe (se fornecido)
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

    // Criar a tarefa
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
