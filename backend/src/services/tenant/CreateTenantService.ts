import prismaClient from "../../prisma";

interface CreateTenantProps {
  name: string;
}

class CreateTenantService {
  async execute({ name }: CreateTenantProps) {
    if (!name) {
      throw new Error("Nome do tenant é obrigatório");
    }

    const tenant = await prismaClient.tenant.create({
      data: {
        name,
      },
    });

    return tenant;
  }
}

export { CreateTenantService };
