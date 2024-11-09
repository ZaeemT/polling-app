import { Request, Response } from "express";
import { authService } from "../services/AuthServices";

class AuthController {
    constructor() {}

    login = async (req: Request, res: Response) => {
        const { status_code, body } = await authService.login(req.body);
        return res.status(status_code).json(body);
    }

    register = async (req: Request, res: Response) => {
        const { status_code, body } = await authService.register(req.body);
        return res.status(status_code).json(body);
    }
}

const authController = new AuthController();

export { authController };