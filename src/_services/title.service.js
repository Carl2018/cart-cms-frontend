import { config, ml } from 'config';
import { authHeader, mlAuthHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const titleService = {
		retrieve,
		retrieveRowCount,
    list,
    update,
    count,
    collect,
    preprocess,
    fit,
    test,
    deploy,
    predict,
    downloadVectorizer,
    downloadClf,
};

function retrieve(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/title/retrieve`);
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
		let url = new URL(`${config.apiUrl}/title/retrieve_row_count`);
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
		let url = new URL(`${config.apiUrl}/title/list`);
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
    return fetch(`${config.apiUrl}/title/update`, requestOptions)
			.then(handleResponse);
}

function count(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/count`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function collect(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/collect`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function preprocess(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/preprocess`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function fit(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/fit`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function test(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/test`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function deploy(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/deploy`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function predict(record) {
    const requestOptions = { 
			method: 'POST', 
			headers: mlAuthHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${ml.domain}/api/title/predict/`, requestOptions)
			.then(handleResponse);
}

function downloadVectorizer(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/download_vectorizer`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}

function downloadClf(params={}) {
		// append query string
		let url = new URL(`${ml.domain}/api/title/download_clf`);
		Object.keys(params).forEach( key => 
			url.searchParams.append(key, params[key]) );
		// call the api
    const requestOptions = { 
			method: 'GET', 
			headers: mlAuthHeader() 
		};
    return fetch(url, requestOptions)
			.then(handleResponse);
}
