import { Request, Response } from "express";
import { CreateProjectService } from "../../services/project/CreateProjectService";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

class CreateProjectController {
  async handle(req: AuthenticatedRequest, res: Response) {
    const { name, description, tenantId } = req.body;
    const createdById = req.userId;

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
