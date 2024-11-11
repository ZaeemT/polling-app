import {apiUrl, constants} from '../utils/constants';
import { GET, POST } from './api.service.wrapper';

export const GetPolls = async () => {
    const response = await GET(apiUrl.poll);
    return response;
}