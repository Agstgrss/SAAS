import prismaClient from "../../prisma";

interface CreateProjectProps {
  name: string;
  description?: string;
  tenantId: string;
  createdById: string;
}

class CreateProjectService {
  async execute({ name, description, tenantId, createdById }: CreateProjectProps) {
    const tenantExists = await prismaClient.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });
    
    if (!tenantExists) {
      throw new Error("Tenant não encontrado!");
    }

    const userExists = await prismaClient.user.findFirst({
      where: {
        id: createdById,
        tenantId: tenantId,
      },
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado no tenant!");
    }

    const project = await prismaClient.project.create({
      data: {
        name,
        description: description || null,
        tenantId,
        createdById,
      },
      select: {
        id: true,
        name: true,
        description: true,
        tenantId: true,
        createdById: true,
        createdAt: true,
      },
    });

    return project;
  }
}

export { CreateProjectService };
