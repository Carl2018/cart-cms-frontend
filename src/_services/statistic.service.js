import { config } from 'config';
import { authHeader } from '_helpers';
import { handleResponse } from '_helpers';

export const statisticService = {
    list,
    apple_subscriber_list,
    apple_subscription_list,
    yesterday_stat
};


function list(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/list`);
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

function yesterday_stat(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/yesterday_stat`);
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

function apple_subscriber_list(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/apple_subscriber_list`);
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

function apple_subscription_list(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/apple_subscription_list`);
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