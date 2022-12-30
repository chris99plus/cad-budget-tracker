import fetch from 'node-fetch';
import { Headers } from 'node-fetch';


/**
 * Execute a GET request to the given microservice.
 */
export async function makeServiceCallGet<T>(serviceUrl: string, path: string, token: string | null = null): Promise<T> {
    let response = await fetch(
        serviceUrl + path,
        {
            headers: buildRequestHeaders(token)
        });

    let responseJson = <any>await response.json();

    if (!responseJson.successful) {
        throw responseJson.message;
    }

    return responseJson.data;
}


/**
 * Execute a POST request to the given microservice.
 */
export async function makeServiceCallPost<T>(
    serviceUrl: string,
    path: string,
    body: any,
    token: string | null = null
): Promise<T | null> {
    let response = await fetch(
        serviceUrl + path,
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: buildRequestHeaders(token)
        });

    let responseJson = <any>await response.json();

    if (!responseJson.successful) {
        throw responseJson.message;
    }

    return responseJson.data;
}


function buildRequestHeaders(token: string | null): Headers {
    let headers: Headers;

    if (token == null) {
        headers = new Headers({
            "Content-Type": "application/json"
        });
    }
    else {
        headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        });
    }

    return headers;
}
