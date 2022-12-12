import fetch from 'node-fetch';


/**
 * Execute a GET request to the given microservice.
 */
export async function makeServiceCallGet<T>(serviceUrl: string, path: string): Promise<T> {
    let response = await fetch(
        serviceUrl + path,
        {
            headers: { "Content-Type": "application/json" }
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
    body: any
): Promise<T | null> {
    let response = await fetch(
        serviceUrl + path,
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });

    let responseJson = <any>await response.json();


    console.log(responseJson);

    if (!responseJson.successful) {
        throw responseJson.message;
    }

    return responseJson.data;
}
