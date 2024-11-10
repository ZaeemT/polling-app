import { IUser } from "../../User/model/IUser";

export interface CreatePollDto {
    title: string;
    description: string;
    options: string[];
    image: Buffer;
    imageType: string;
    user: IUser;
}