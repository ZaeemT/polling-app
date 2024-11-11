import { apiUrl } from '../utils/constants';
import { GET, POST } from './api.service.wrapper';

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