import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import { createToken } from '../helpers/createToken';
import articleRequestPayload from '../request-objects/POST-article.json';

let authToken: string;

test.beforeAll('run before all', async ({ api, config }) => {
    authToken = await createToken(config.userEmail, config.userPassword);
});


test('Test Get Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200);
        
    // Validate Schema   
    await expect(response).shouldMatchSchema('tags', 'GET_tags', true);     
});


test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    // Validate Schema
    await expect(response).shouldMatchSchema('articles', 'GET_articles', true);

    expect(response.articlesCount).shouldEqual(10);
    expect(response.articlesCount).shouldBeLessThanOrEqual(10);
});


test('Create and delete Article', async ({ api }) => {
    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(articleRequestPayload)
        .postRequest(201)

    // Validate Schema   
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article', true);  
    
    expect(createArticleResponse.article.title).shouldEqual('New Test');
    const slugId = createArticleResponse.article.slug;

    // GET - Assertion
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
    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(articleRequestPayload)
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

     // Modify payload property to update existing article.
    articleRequestPayload.article.title = 'New Test 2';

    // PUT - Update Article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body(articleRequestPayload)
        .putRequest(200)

    expect(updateArticleResponse.article.title).shouldEqual('New Test 2');
    const slugId2 = updateArticleResponse.article.slug;

    // DELETE - the Article
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