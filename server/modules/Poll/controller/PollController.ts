import { Request, Response } from "express";
import { pollService } from "../services/PollService";
import { CreatePollDto } from "../dto";

class PollController {
    constructor() {}

    createPoll = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }
        
            const pollData: CreatePollDto = {
                ...req.body,
                image: req.file.buffer,
                imageType: req.file.mimetype,
                user: req.user
            };


        const { status_code, body } = await pollService.createPoll(pollData);
        return res.status(status_code).json(body);
    }

    getPolls = async (req: Request, res: Response) => {
        const { status_code, body } = await pollService.getPolls();
        return res.status(status_code).json(body);
    }

    getPollById = async (req: Request, res: Response) => {
        const { status_code, body } = await pollService.getPollsById(req.params.id);
        return res.status(status_code).json(body); 
    }
}

const pollController = new PollController();

export { pollController };