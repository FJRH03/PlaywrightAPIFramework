import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-expect';
import { config } from '../api-test.config';

export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export const test = base.extend<TestOptions>({
    api: async ({ request }, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const requestHanlder = new RequestHandler(request, config.apiUrl, logger);
        await use(requestHanlder);
    },
    config: async ({}, use) => {
        await use(config);
    }
});