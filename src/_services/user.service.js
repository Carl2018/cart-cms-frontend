//import config from 'config';
import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const userService = {
    list,
};

function list() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/user/list`, requestOptions)
			.then(handleResponse)
			.then(data => {
					return data;
			});
}
