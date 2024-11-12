import { RequestHandler, Router } from "express";
import { loginValidator, registerValidator } from "../../../validator/authValidator";
import { authController } from "../../../controller/AuthController";
import { validateRequestBody } from "../../../../../utils/validator/ValidateRequest";

const router = Router();

router.post(
    "/login",
    validateRequestBody(loginValidator) as RequestHandler, 
    authController.login as any
);

router.post(
    "/register",
    validateRequestBody(registerValidator) as RequestHandler,
    authController.register as any
)

export { router };