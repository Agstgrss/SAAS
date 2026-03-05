import { Request, Response } from "express";
import { CreateTaskService } from "../../services/task/CreateTaskService";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

class CreateTaskController {
  async handle(req: any, res: Response) {
    const userId = req.user_id;

    const { title, description, projectId, status, assignedToId, dueDate } = req.body;

    const service = new CreateTaskService();

    const task = await service.execute({
      userId,
      title,
      description,
      projectId,
      status,
      assignedToId,
      dueDate,
    });

    return res.json(task);
  }
}

export { CreateTaskController };
