import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {

    private request!: APIRequestContext;
    private logger!: APILogger;
    private baseUrl!: string;
    private defaultBaseURL: string;
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request;
        this.defaultBaseURL = apiBaseUrl;
        this.logger = logger;
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
    async getRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('GET', url, this.apiHeaders)
        const response = await this.request.get(url, {
            headers: this.apiHeaders,
        });
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest);

        return responseJSON;
    }

    /**
     * POST -
     * This functions performs a POST request and returns a JSON format response.
     * @param status (expected status code)
     * @returns responseJSON
     */
    async postRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        const actualStatus = response.status();
        const responseJSON = response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest);

        return responseJSON;
    }

    /**
     * PUT -
     * This functions performs a PUT request and returns a JSON format response.
     * @param status (expected status code)
     * @returns responseJSON
     */
    async putRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest);

        return responseJSON;
    }

    /** 
     * DELETE -
     * This function performs DELETE HTTP method.
     * @param status (expected status code)
     */
    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest('DELETE', url, this.apiHeaders)
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        });
        const actualStatus = response.status();
        this.logger.logResponse(actualStatus);
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest);
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

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code ${expectedStatus} but got ${actualStatus}\n\nRecent API activity: \n${logs}`);
            Error.captureStackTrace(error, callingMethod);
            throw error;
        }
    }
}