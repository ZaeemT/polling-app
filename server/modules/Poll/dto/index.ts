import { IUser } from "../../User/model/IUser";

export interface CreatePollDto {
    title: string;
    description: string;
    options: string[];
    image: Buffer;
    imageType: string;
    user: IUser;
}

export interface UpdatePollDto {
    // id: string;
    title: string;
    description: string;
    options: string[];
    image: Buffer;
    imageType: string;
    // user: IUser;
}

export interface votePollDto {
    option: string;
    user_id?: string;
    ipAddress?: string;
}