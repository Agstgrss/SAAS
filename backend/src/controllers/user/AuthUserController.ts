import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authService = new AuthUserService();
      const auth = await authService.execute({ email, password });

      return res.json(auth);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }
}


export { AuthUserController };
