import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const conversationService = {
    list,
    listContent,
};

function list(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/conversation/list`);
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

function listContent(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/conversation/list_content`);
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
