import { Request, Response } from "express";
import { CreateTenantService } from "../../services/tenant/CreateTenantService";

class CreateTenantController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;

    const service = new CreateTenantService();

    const tenant = await service.execute({ name });

    return res.json(tenant);
  }
}

export { CreateTenantController };
