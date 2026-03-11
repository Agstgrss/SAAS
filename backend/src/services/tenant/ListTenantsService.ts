import prismaClient from "../../prisma";

class ListTenantsService {
  async execute() {
    const tenants = await prismaClient.tenant.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return tenants;
  }
}

export { ListTenantsService };
