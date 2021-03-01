import { config } from 'config';
import { authHeader } from '_helpers';
import { authHeader,authHeaderWithoutContentType } from '_helpers';

export const statisticService = {
    list,
    apple_subscriber_list,
    apple_subscription_list,
    yesterday_stat,
    revenue_list,
    csv_import
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

function revenue_list(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/revenue_list`);
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

function csv_import(file) {
    const requestOptions = {
        method: "POST",
        headers: authHeaderWithoutContentType(),
        body: file 
    }
    return fetch(`${config.apiUrl}/statistic/csv_import`, requestOptions).then(handleResponse)
}