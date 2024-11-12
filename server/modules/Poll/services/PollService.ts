import { CreatePollDto, UpdatePollDto, votePollDto } from "../dto";
import { db } from "../../../DB";
import { Utils } from "../../../utils/utils";
import { httpServer } from "../../../http";
// import { IUser } from "../../User/model/IUser";
import { optimizeImage } from "../../../utils/imageShrink";
import { IPoll } from "../model/IPoll";
import { ulid } from "ulidx";
import { IUser } from "../../User/model/IUser";

class PollService {
    createPoll = async (createPollDto: CreatePollDto) => {
        const { title, description, options, image, imageType, user } = createPollDto;

        const exist = await db.users.findOne({ id: user.id });
        if (!exist) {
            return Utils.getResponse("User not found", 404);
        }

        if (options.length < 2 || options.length > 5) {
            return Utils.getResponse("Poll must have between 2 and 5 options.", 422);
        }
        const pollOptions = options.map((option) => ({ text: option, votes: 0 }));

        const {
            optimizedImage,
            initialSize,
            optimizedSize
        } = await optimizeImage(image);

        const newPoll: IPoll = {
            id: ulid(),
            title,
            description,
            options: pollOptions,
            image: optimizedImage,
            imageType: imageType,
            originalImageSize: initialSize,
            optimizedImageSize: optimizedSize,
            // user_id: user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            user_id: user.id,
            anonymousVotes: [],
            userVotes: []
        }

        const result = await db.polls.insertOne(newPoll);
        if (result.acknowledged) {
            const response = { poll: newPoll, user: exist };
            return Utils.getResponse("Poll created", 201, response);
        } else {
            return Utils.getResponse("Poll creation failed", 500);
        }
    }

    getPolls = async () => {
        const polls = await db.polls.find({}).toArray();

        if (polls.length > 0) {
            return Utils.getResponse("All polls fetched", 200, { polls });
        } else {
            return Utils.getResponse("There are no active polls", 500);
        }
    }

    getPollsById = async (pollId: string) => {
        const poll = await db.polls.findOne({ id: pollId });

        if (poll) {
            return Utils.getResponse("Poll fetched", 200, { poll });
        } else {
            return Utils.getResponse("Poll does not exist", 500);
        }
    }

    deletePoll = async (id: string) => {
        const poll = await db.polls.deleteOne({ id });

        if (poll) {
            return Utils.getResponse("Poll deleted successfully", 200, { poll });
        } else {
            return Utils.getResponse("Unable to delete poll", 500);
        }
    }

    updatePoll = async (id: string, updatePollDto: UpdatePollDto, user: IUser) => {
        const { title, description, options, image, imageType } = updatePollDto;

        const exist = await db.polls.findOne({ id });
        if (!exist) {
            return Utils.getResponse("Poll not found", 404);
        }

        if (exist.user_id != user.id) {
            return Utils.getResponse("Only the creator can update this poll", 403);
        }

        if (options.length < 2 || options.length > 5) {
            return Utils.getResponse("Poll must have between 2 and 5 options.", 422);
        }
        const pollOptions = options.map((option: any) => ({ text: option, votes: 0 }));

        const {
            optimizedImage,
            initialSize,
            optimizedSize
        } = await optimizeImage(image);

        const updatePoll: Partial<IPoll> = {
            title,
            description,
            options: pollOptions,
            image: optimizedImage,
            imageType: imageType,
            originalImageSize: initialSize,
            optimizedImageSize: optimizedSize,
            // user_id: user._id,
            // createdAt: new Date(),
            updatedAt: new Date(),
            // user_id: user.id,
        }

        const poll = await db.polls.findOneAndUpdate(
            { id },
            { $set: updatePoll },
            { returnDocument: 'after' }
        );

        if (poll) {
            const response = { poll };
            return Utils.getResponse("Poll updated successfully", 201, response);
        } else {
            return Utils.getResponse("Poll update failed", 500);
        }
    }

    vote = async (id: string, votePollDto: votePollDto) => {
        const { option, user_id, ipAddress } = votePollDto;

        const poll = await db.polls.findOne({ id });
        if (!poll) {
            return Utils.getResponse("Poll not found", 404);
        }

        if (user_id && Array.isArray(poll.userVotes) && poll.userVotes.includes(user_id)) {
            return Utils.getResponse("User has already voted", 500);
        }
        if (ipAddress && Array.isArray(poll.anonymousVotes) && poll.anonymousVotes.includes(ipAddress)) {
            return Utils.getResponse("Anonymous user has already voted", 500);
        }

        const result = await db.polls.findOneAndUpdate(
            { id, 'options.text': option },
            {
                $inc: { 'options.$.votes': 1 },
                $push: user_id ?
                    { userVotes: user_id } :
                    { anonymousVotes: ipAddress }
            },
            { returnDocument: 'after' }
        );

        if (result) {
            httpServer.io.to(`poll-${poll.id}`).emit("pollUpdated", result);
            return Utils.getResponse("Vote registered successfully", 200, result);
        } else {
            return Utils.getResponse("Vote failed", 500);
        }

    }
}

const pollService = new PollService();

export { pollService };