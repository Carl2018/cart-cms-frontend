import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const processService = {
    create,
    list,
    update,
};

function create(record) {
    const requestOptions = { 
			method: 'POST', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/process/create`, requestOptions)
			.then(handleResponse);
}

function list(filters) {
		// append query string
		let url = new URL(`${config.apiUrl}/process/list`);
		Object.keys(filters).forEach( key => 
			url.searchParams.append(key, filters[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: authHeader(),
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function update(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/process/update`, requestOptions)
			.then(handleResponse);
}
