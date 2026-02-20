import { Request, Response } from "express";
import { CreateProjectService } from "../../services/project/CreateProjectService";

class CreateProjectController {
  async handle(req: Request, res: Response) {
    const { name, description, tenantId } = req.body;

    console.log("Dados recebidos para criação de projeto:", { name, description, tenantId });
    console.log("User ID do token:", req.user_id);
    const createdById = req.user_id;

    if (!createdById) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const service = new CreateProjectService();

    const project = await service.execute({
      name,
      description,
      tenantId,
      createdById,
    });

    return res.json(project);
  }
}

export { CreateProjectController };
