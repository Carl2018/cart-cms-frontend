import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const accountService = {
    create,
    list,
    listByEmail,
    update,
    ban,
    hide,
};

function create(record) {
    const requestOptions = { 
			method: 'POST', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/account/create`, requestOptions)
			.then(handleResponse);
}

function list() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account/list`, requestOptions)
			.then(handleResponse);
}

function listByEmail(filters) {
		// append query string
		let url = new URL(`${config.apiUrl}/account/list_by_email`);
		Object.keys(filters).forEach( key => 
			url.searchParams.append(key, filters[key]) );
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function update(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/account/update`, requestOptions)
			.then(handleResponse);
}

function ban(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/account/ban`, requestOptions)
			.then(handleResponse);
}

function hide(ids) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify({ ids })
		};
    return fetch(`${config.apiUrl}/account/hide`, requestOptions)
			.then(handleResponse);
}
