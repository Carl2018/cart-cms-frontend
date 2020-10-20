import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const blacklistService = {
		retrieve,
    search,
    unban,
};

function retrieve(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/blacklist/retrieve`);
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

function search(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/blacklist/search`);
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

function unban(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/blacklist/unban`, requestOptions)
			.then(handleResponse);
}
