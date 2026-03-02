// backend/src/controllers/project/CreateProjectController.ts
import { Request, Response } from "express";
import { CreateProjectService } from "../../services/project/CreateProjectService";
import prismaClient from "../../prisma";

class CreateProjectController {
  async handle(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      const createdById = req.user_id;

      if (!createdById) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const user = await prismaClient.user.findUnique({
        where: { id: createdById },
        select: { tenantId: true },
      });

      if (!user || !user.tenantId) {
        return res.status(400).json({ error: "Usuário sem tenant associado" });
      }

      const tenantId = user.tenantId;

      const service = new CreateProjectService();
      const project = await service.execute({
        name,
        description,
        tenantId,
        createdById,
      });

      return res.status(201).json(project);
    } catch (err: any) {
      console.error("Erro ao criar projeto:", err);
      return res.status(500).json({ error: "Erro ao criar projeto" });
    }
  }
}

export { CreateProjectController };