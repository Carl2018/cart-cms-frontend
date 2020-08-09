import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const accountService = {
    create,
    retrieve,
		retrieveCandidateId,
    retrieveFlag,
    retrieveConversation,
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

function retrieve(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/account/retrieve`);
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

function retrieveCandidateId(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/account/retrieve_candidate_id`);
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

function retrieveFlag(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/account/retrieve_flag`);
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

function retrieveConversation(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/account/retrieve_conversation_record`);
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
		let url = new URL(`${config.apiUrl}/account/list`);
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
