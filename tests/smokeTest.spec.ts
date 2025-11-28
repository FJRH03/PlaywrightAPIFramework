import { test } from '../utils/fixtures';

test('first test', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    console.log(response);
});