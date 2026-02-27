import prismaClient from "../../prisma";

export class ListProjectsService {
  async execute(userId: string) {
    if (!userId) {
      throw new Error("User ID not provided");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const projects = await prismaClient.project.findMany({
      where: {
        tenantId: user.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  }
}