import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const externalService = {
		retrieve,
    searchBlacklist,
    unbanBlacklist,
};

function retrieve(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/external/retrieve`);
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

function searchBlacklist(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/external/search_blacklist`);
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

function unbanBlacklist(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/external/unban_blacklist`, requestOptions)
			.then(handleResponse);
}
