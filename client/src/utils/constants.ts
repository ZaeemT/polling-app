export const BASE_URL = 'http://localhost:3000/api/v1/';  // Replace with your API base URL

export const constants = {
  BASE_URL,
  LOCAL_STORAGE_TOKEN: 'token',
  LOCAL_STORAGE_USER: 'user',
};

export const apiUrl = {
  login: 'login',
  register: 'register',
  poll: 'poll',
  create_poll: 'poll/create-poll',
  vote: 'poll/:id/vote'
}