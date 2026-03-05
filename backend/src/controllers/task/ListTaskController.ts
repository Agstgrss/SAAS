import { Request, Response } from "express";
import { ListTasksService } from "../../services/task/ListTaskService";

export class ListTasksController {
  async handle(req: Request, res: Response) {
    const userId = req.user_id;
    const { projectId } = req.query;

    const service = new ListTasksService();
    const tasks = await service.execute(
      userId,
      String(projectId)
    );

    return res.json(tasks);
  }
}