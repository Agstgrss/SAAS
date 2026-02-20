import { Request, Response } from "express";
import { CreateTaskService } from "../../services/task/CreateTaskService";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

class CreateTaskController {
  async handle(req: AuthenticatedRequest, res: Response) {
    const { title, description, projectId, tenantId, status, assignedToId, dueDate } = req.body;

    const service = new CreateTaskService();

    const task = await service.execute({
      title,
      description,
      projectId,
      tenantId,
      status,
      assignedToId,
      dueDate,
    });

    return res.json(task);
  }
}

export { CreateTaskController };
