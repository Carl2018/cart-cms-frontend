import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const categoryService = {
    list,
};

function list() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/category/list`, requestOptions)
			.then(handleResponse);
}
