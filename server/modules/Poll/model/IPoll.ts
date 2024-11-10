import { IUser } from "../../User/model/IUser";

export interface IPoll {
    id: string;
    title: string;
    description: string;
    options: { text: string; votes: number }[];
    image: Buffer;
    imageType: string;
    originalImageSize: number;
    optimizedImageSize: number;
    // user_id: string;
    createdAt?: Date;
    updatedAt?: Date;
    user_id: string;
    anonymousVotes: string[]; // Array of IP addresses for anonymous voters
    userVotes: string[]; // Array of user IDs who voted
}
