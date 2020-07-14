import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const categoryService = {
    create,
    list,
    update,
    hide,
};

function create(record) {
    const requestOptions = { 
			method: 'POST', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/category/create`, requestOptions)
			.then(handleResponse);
}

function list() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/category/list`, requestOptions)
			.then(handleResponse);
}

function update(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/category/update`, requestOptions)
			.then(handleResponse);
}

function hide(ids) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify({ ids })
		};
    return fetch(`${config.apiUrl}/category/hide`, requestOptions)
			.then(handleResponse);
}
