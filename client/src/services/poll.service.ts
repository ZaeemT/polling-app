import { apiUrl } from '../utils/constants';
import { DELETE, GET, POST, PUT } from './api.service.wrapper';

export const GetPolls = async () => {
    const response = await GET(apiUrl.poll);
    return response;
}

export const CreatePoll = async (data: any) => {
    const config = {
        headers: {
            "content-type": "multipart/form-data",
        },
    }
    const response = await POST(apiUrl.create_poll, data, config);
    return response;
}

export const GetPollById = async (id: string) => {
    const response = await GET(apiUrl.poll + '/' + id);
    return response;
}

export const VotePoll = async  (id: string, data: any) => {
    const response = await POST(apiUrl.poll + '/' + id + '/vote', data);
    return response;
}

export const DeletePoll = async (id: string) => {
    const response = await DELETE(apiUrl.poll, id);
    return response;
}

export const UpdatePoll = async (id: string, data: any) => {
    const response = await PUT(apiUrl.poll, id, data);
    return response;
}