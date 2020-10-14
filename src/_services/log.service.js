import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const logService = {
		retrieveRowCount,
    list,
};

function retrieveRowCount(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/log/retrieve_row_count`);
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
		let url = new URL(`${config.apiUrl}/log/list`);
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
