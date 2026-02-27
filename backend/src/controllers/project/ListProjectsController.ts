import { Request, Response } from "express";
import { ListProjectsService } from "../../services/project/ListProjectsService";

export class ListProjectsController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user_id;

      const service = new ListProjectsService();
      const projects = await service.execute(userId);

      return res.json(projects);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}