import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, tenantId } = req.body;

    const service = new CreateUserService();

    const user = await service.execute({
      name,
      email,
      password,
      tenantId,
    });

    return res.json(user);
  }
}

export { CreateUserController };
