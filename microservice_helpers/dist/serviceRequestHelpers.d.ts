/**
 * Execute a GET request to the given microservice.
 */
export declare function makeServiceCallGet<T>(serviceUrl: string, path: string): Promise<T>;
/**
 * Execute a POST request to the given microservice.
 */
export declare function makeServiceCallPost<T>(serviceUrl: string, path: string, body: any): Promise<T | null>;
