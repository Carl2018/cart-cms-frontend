//import config from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const userService = {
    getAll,
    list,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    //return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
    return fetch(`/users`, requestOptions).then(handleResponse);
}

function list() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/user/list`, requestOptions)
			.then(handleResponse)
			.then(data => {
					return data;
			});
}
