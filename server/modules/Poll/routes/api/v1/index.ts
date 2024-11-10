import { RequestHandler, Router } from "express";
import multer from "multer";
import { createPollValidator } from "../../../validator/pollValidator";
import { validateRequestBody } from "../../../../../utils/validator/ValidateRequest";
import { pollController } from "../../../controller/PollController";
import { requireAuth } from "../../../../../middlewares/requireAuth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/create-poll",
    requireAuth as RequestHandler,
    upload.single('image'),
    validateRequestBody(createPollValidator) as RequestHandler,
    pollController.createPoll as any
);

export { router };