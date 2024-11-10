import { CreatePollDto } from "../dto";
import { db } from "../../../DB";
import { Utils } from "../../../utils/utils";
// import { IUser } from "../../User/model/IUser";
import { optimizeImage } from "../../../utils/imageShrink";
import { IPoll } from "../model/IPoll";
import { ulid } from "ulidx";

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
        }

        const result = await db.polls.insertOne(newPoll);
        if (result.acknowledged) {
            const response = { poll: newPoll, user: exist };
            return Utils.getResponse("Poll created", 201, response);
        } else {
            return Utils.getResponse("Poll creation failed", 500);
        }
    }
}

const pollService = new PollService();

export { pollService };