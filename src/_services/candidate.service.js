import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const candidateService = {
		retrieve,
		retrieveDetails,
    list,
    search_by_keywords,
    ban,
};

function retrieve(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve`);
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

function retrieveDetails(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve_details`);
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
		let url = new URL(`${config.apiUrl}/candidate/list`);
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

function search_by_keywords(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/search_by_keywords`);
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

function ban(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/candidate/ban`, requestOptions)
			.then(handleResponse);
}
