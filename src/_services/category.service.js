import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const categoryService = {
    create,
		retrieve,
		retrieveRowCount,
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

function retrieve(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/category/retrieve`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: authHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function retrieveRowCount(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/category/retrieve_row_count`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
		const requestOptions = { 
			method: 'GET', 
			headers: authHeader() 
		};
		return fetch(url, requestOptions)
			.then(handleResponse);
}

function list(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/category/list`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: authHeader() 
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
    return fetch(`${config.apiUrl}/category/update`, requestOptions)
			.then(handleResponse);
}

function hide(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/category/hide`, requestOptions)
			.then(handleResponse);
}
