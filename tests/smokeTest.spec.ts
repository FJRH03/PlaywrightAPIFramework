import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';

let authToken: string;

test.beforeAll('run before all', async ({ api }) => {
    const payload = { "user": { "email": "franktest@test.com", "password": "Test1234" } };
    const tokenResponse = await api
        .path('/users/login')
        .body(payload)
        .postRequest(200)
    authToken = 'Token ' + tokenResponse.user.token;
});

test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 2, offset: 0 })
        .getRequest(200);
});


test('Test Get Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200);
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
    expect(createArticleResponse.article.title).toEqual('New Test');
    const slugId = createArticleResponse.article.slug;

    // Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).toEqual('New Test');

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
    expect(articlesResponse2).not.toEqual('New Test');
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
    expect(createArticleResponse.article.title).toEqual('New Test');
    const slugId = createArticleResponse.article.slug;
    console.log(slugId);

    // GET -  Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).toEqual('New Test');

    // PUT - Update Article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body(articlePayload2)
        .putRequest(200)
    expect(updateArticleResponse.article.title).toEqual('New Test 2');
    const slugId2 = updateArticleResponse.article.slug;
    console.log(slugId2);

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
    expect(articlesResponse2).not.toEqual('New Test 2');
});