import { APIRequestContext, expect } from "@playwright/test";

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
     * This function sends an API request to the endpoint and returns a response in JSON format.
     * @returns ${responseJSON}
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
}