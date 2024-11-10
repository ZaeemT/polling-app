import { RequestHandler, Router } from "express";
import multer from "multer";
import { createPollValidator, updatePollValidator, votePollValidator } from "../../../validator/pollValidator";
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
    validateRequestBody(updatePollValidator) as RequestHandler,
    pollController.updatePoll as any
)

router.post(
    "/:id/vote",
    optionalAuth as RequestHandler,
    validateRequestBody(votePollValidator) as RequestHandler,
    pollController.vote as any
)

export { router };