import {apiUrl, constants} from '../utils/constants';
import { POST } from './api.service.wrapper';

const storageKey = constants.LOCAL_STORAGE_TOKEN;
const storageUser = constants.LOCAL_STORAGE_USER;


export const SetToken = (token: string | null) => {
    if (token) localStorage.setItem(storageKey, token);
    else localStorage.removeItem(storageKey);
}

export const GetToken = () => {
    return localStorage.getItem(storageKey);
}

export const SetAuthUser = (user_data: string) => {
    if (user_data) localStorage.setItem(storageUser, user_data);
    else localStorage.removeItem(storageUser);
}

export const GetAuthUser = () => {
    const user = localStorage.getItem(storageUser);
    return user ? JSON.parse(user) : null;
}

export const GetAccessToken = () => {
    return localStorage.getItem(storageKey);
}

export const Login = async (email: string, password: string) => {
    const response = await POST(apiUrl.login, {email, password});
    await SetToken(response.data?.token);
    await SetAuthUser(JSON.stringify(response.data?.user));
    return response;
}

export const Register = async (username: string, email: string, password: string) => {
    const response = await POST(apiUrl.register, {username, email, password});
    await SetToken(response.data?.token);
    await SetAuthUser(JSON.stringify(response.data?.user));
    return response;
}

export const Logout = async () => {
    // const response = await POST(apiUrl.logout, { device_token, device_type});
    await EmptyLocalStorage();
    return;
}

export const EmptyLocalStorage = async () => {
    await localStorage.removeItem(storageUser);
    return await localStorage.removeItem(storageKey)
}

export const GetCurrentUser = () => {
    const user = localStorage.getItem(storageUser);
    return user ? JSON.parse(user) : null;
}


