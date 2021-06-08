import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const candidateService = {
		retrieve,
		retrieveDetails,
    list,
    search_by_keywords,
    search_by_cid,
    listInvitations,
		retrieveInvitationRowCount,
    listLoginLogs,
		retrieveLoginLogRowCount,
    listPayments,
		retrievePaymentRowCount,
    listRedisLogs,
		retrieveRedisLogRowCount,
		retrieveCandidateProfile,
    listCandidatesByUdid,
    ban,
    updateCandidateGender,
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

function search_by_cid(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/search_by_cid`);
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

function listInvitations(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/list_invitations`);
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

function retrieveInvitationRowCount(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve_invitation_row_count`);
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

function listLoginLogs(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/list_login_logs`);
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

function retrieveLoginLogRowCount(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve_login_log_row_count`);
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

function listPayments(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/list_payments`);
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

function retrievePaymentRowCount(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve_payment_row_count`);
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

function listRedisLogs(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/list_redis_logs`);
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

function retrieveRedisLogRowCount(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve_redis_log_row_count`);
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

function retrieveCandidateProfile(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/retrieve_candidate_profile`);
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

function listCandidatesByUdid(params={}) {
		// append query string
		let url = new URL(`${config.apiUrl}/candidate/list_candidates_by_udid`);
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

function updateCandidateGender(record) {
    const requestOptions = { 
			method: 'PUT', 
			headers: authHeader(),
			body: JSON.stringify(record)
		};
    return fetch(`${config.apiUrl}/candidate/update_candidate_gender`, requestOptions)
			.then(handleResponse);
}
