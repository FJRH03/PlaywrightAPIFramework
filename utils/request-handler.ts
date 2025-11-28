import { APIRequestContext, expect } from "@playwright/test";
import { resolve } from "path";

export class RequestHandler {

    private request!: APIRequestContext;
    private baseUrl!: string;
    private defaultBaseURL: string;
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};

    constructor(request: APIRequestContext, apiBaseUrl: string) {
        this.request = request;
        this.defaultBaseURL = apiBaseUrl;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: object) {
        this.queryParams = params;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }

    body(body: object) {
        this.apiBody = body;
        return this;
    }

    /** 
     * GET -
     * This function sends an API request to the endpoint and returns a JSON format response.
     * @param status (expected status code)
     * @returns responseJSON
     */
    async getRequest(status: number) {
        const url = this.getUrl();
        const response = await this.request.get(url, {
            headers: this.apiHeaders,
        });

        // Assertion
        expect(response.status()).toEqual(status);
        const responseJSON = await response.json();
        return responseJSON;
    }

    /**
     * POST -
     * This functions performs a POST request and returns a JSON format response.
     * @param status (expected status code)
     * @returns responseJSON
     */
    async postRequest(status: number){
        const url = this.getUrl();
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        // Assertion
        expect(response.status()).toEqual(status);
        const responseJSON = await response.json();
        return responseJSON;
    }
    
    /**
     * PUT -
     * This functions performs a PUT request and returns a JSON format response.
     * @param status (expected status code)
     * @returns responseJSON
     */
    async putRequest(status: number){
        const url = this.getUrl();
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        // Assertion
        expect(response.status()).toEqual(status);
        const responseJSON = await response.json();
        return responseJSON;
    }

    /** 
     * DELETE -
     * This function performs DELETE HTTP method.
     * @param status (expected status code)
     */
    async deleteRequest(status: number) {
        const url = this.getUrl();
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        });
        expect(response.status()).toEqual(status);
    }

    /**
     * This functions builds the URL with params (if needed) and return the final URL as string object
     * @returns url (string)
     */
    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseURL}${this.apiPath}`);

        // get paramas object[] and extract them as string values.
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        return url.toString();
    }

    delay(ms: number ){
        return new Promise( resolve => setTimeout(resolve, ms));
    }
}