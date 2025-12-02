import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import { createToken } from '../helpers/createToken';
import { validateSchema } from '../utils/schema-validator';

let authToken: string;

test.beforeAll('run before all', async ({ api, config }) => {
    authToken = await createToken(config.userEmail, config.userPassword);
});

test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 2, offset: 0 })
        .getRequest(200);
    expect(response.articlesCount).shouldEqual(10);
    expect(response.articlesCount).shouldBeLessThanOrEqual(10);
});


test('Test Get Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200);
        
    // Validate Schema   
    await expect(response).shouldMatchSchema('tags', 'GET_tags', true);     
});

test('Create and delete Article', async ({ api }) => {
    // Create article body payload.
    const articlePayload = {
        "article":
        {
            "title": "New Test",
            "description": "This is a Frank Test",
            "body": "This is a description for frank test",
            "tagList": []
        }
    };

    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(articlePayload)
        .postRequest(201)
    expect(createArticleResponse.article.title).shouldEqual('New Test');
    const slugId = createArticleResponse.article.slug;

    // Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).shouldEqual('New Test');

    // DELETE the Article
    const deleteResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204);

    // Validate deletion successfully
    const articlesResponse2 = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);
    expect(articlesResponse2).not.shouldEqual('New Test');
});

test('Create, Update and Delete Article', async ({ api }) => {
    // Create article body payload.
    const articlePayload = {
        "article":
        {
            "title": "New Test",
            "description": "This is a Frank Test",
            "body": "This is a description for frank test",
            "tagList": []
        }
    };

    // Create body payload to update article.
    const articlePayload2 = {
        "article":
        {
            "title": "New Test 2",
            "description": "This is a Frank Test 2",
            "body": "This is a description for frank test 2",
            "tagList": []
        }
    };

    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(articlePayload)
        .postRequest(201)
    expect(createArticleResponse.article.title).shouldEqual('New Test');
    const slugId = createArticleResponse.article.slug;

    // GET -  Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).shouldEqual('New Test');

    // PUT - Update Article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body(articlePayload2)
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual('New Test 2');
    const slugId2 = updateArticleResponse.article.slug;

    // DELETE the Article
    const deleteResponse = await api
        .path(`/articles/${slugId2}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204);

    // GET -  Validate deletion successfully
    const articlesResponse2 = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);
    expect(articlesResponse2).not.shouldEqual('New Test 2');
});