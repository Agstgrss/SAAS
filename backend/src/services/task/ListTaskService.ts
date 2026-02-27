import { Request, Response } from "express";
import prismaClient from "../../prisma";  

export class ListTasksService {
  async execute(userId: string, projectId: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const tasks = await prismaClient.task.findMany({
      where: {
        projectId,
        tenantId: user.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return tasks;
  }
}