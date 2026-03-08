import { Request, Response } from "express";
import { ListTenantsService } from "../../services/tenant/ListTenantsService";

class ListTenantsController {
  async handle(req: Request, res: Response) {
    const service = new ListTenantsService();
    const tenants = await service.execute();

    return res.json(tenants);
  }
}

export { ListTenantsController };
