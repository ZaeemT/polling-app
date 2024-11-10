import { RequestHandler, Router } from "express";
import multer from "multer";
import { createPollValidator } from "../../../validator/pollValidator";
import { validateRequestBody } from "../../../../../utils/validator/ValidateRequest";
import { pollController } from "../../../controller/PollController";
import { requireAuth } from "../../../../../middlewares/requireAuth";
import { optionalAuth } from "../../../../../middlewares/optionalAuth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/create-poll",
    requireAuth as RequestHandler,
    upload.single('image'),
    validateRequestBody(createPollValidator) as RequestHandler,
    pollController.createPoll as any
);

router.get(
    "/",
    optionalAuth as RequestHandler,
    pollController.getPolls as any
)

router.get(
    "/:id",
    optionalAuth as RequestHandler,
    pollController.getPollById as any
)

router.delete(
    "/:id",
    requireAuth as RequestHandler,
    pollController.deletePoll as any
)

router.put(
    "/:id",
    requireAuth as RequestHandler,
    upload.single('image'),
    pollController.updatePoll as any
)

export { router };