import { Request, Response } from "express";
import { UpdateTaskService } from "../../services/task/UpdateTaskService";

class UpdateTaskController {
  async handle(req: any, res: Response) {
    const userId = req.user_id;
    const { id } = req.params;
    const { status, title, description, dueDate } = req.body;

    const service = new UpdateTaskService();

    const task = await service.execute({
      userId,
      taskId: id,
      status,
      title,
      description,
      dueDate,
    });

    return res.json(task);
  }
}

export { UpdateTaskController };