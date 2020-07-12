//import config from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const userService = {
    getAll
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    //return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
    return fetch(`/users`, requestOptions).then(handleResponse);
}
