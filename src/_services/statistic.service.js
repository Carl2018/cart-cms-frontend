import { config } from 'config';
import { authHeader,authHeaderWithoutContentType,handleResponse } from '_helpers';

export const statisticService = {
    list,
    apple_subscriber_list,
    apple_subscription_list,
    yesterday_stat,
    revenue_list,
    csv_import,
    redis_logs,
    retrieve_row_count,
    category_lists,
    log_value_lists
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
        body: {file: file.file}
    }
    return fetch(`${config.apiUrl}/statistic/csv_import`, requestOptions).then(handleResponse)
}

function redis_logs(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/redis_logs`);
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

function retrieve_row_count(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/retrieve_row_count`);
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

function category_lists(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/category_lists`);
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

function log_value_lists(params={}) {
    // append query string
    let url = new URL(`${config.apiUrl}/statistic/log_value_lists`);
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