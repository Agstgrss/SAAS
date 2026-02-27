import { Request, Response } from "express";
import { DeleteTaskService } from "../../services/task/DeleteTaskService";

class DeleteTaskController {
  async handle(req: any, res: Response) {
    const userId = req.user_id;
    const { id } = req.params;

    const service = new DeleteTaskService();

    await service.execute({
      userId,
      taskId: id,
    });

    return res.json({ message: "Deletado com sucesso" });
  }
}

export { DeleteTaskController };