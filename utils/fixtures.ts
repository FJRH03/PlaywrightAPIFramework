import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-expect';

export type TestOptions = {
    api: RequestHandler
}

export const test = base.extend<TestOptions>({
    api: async ({ request }, use) => {
        const logger = new APILogger();
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        setCustomExpectLogger(logger);
        const requestHanlder = new RequestHandler(request, baseUrl, logger);
        await use(requestHanlder);
    }
});