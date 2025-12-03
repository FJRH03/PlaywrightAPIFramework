import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { createToken } from '../../helpers/createToken';
import articleRequestPayload from '../../request-objects/POST-article.json';
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';

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

    // Save current JSON article title.
    const newArticleTitle = articleRequestPayload.article.title;

    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(articleRequestPayload)
        .postRequest(201)

    // Validate Schema   
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article', true);

    expect(createArticleResponse.article.title).shouldEqual(newArticleTitle);
    const slugId = createArticleResponse.article.slug;

    // GET - Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).shouldEqual(newArticleTitle);

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

    expect(articlesResponse2).not.shouldEqual(newArticleTitle);
});


test('Create, Update and Delete Article', async ({ api }) => {

    // Save current JSON article title.
    const newArticleTitle = articleRequestPayload.article.title;

    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(articleRequestPayload)
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual(newArticleTitle);
    const slugId = createArticleResponse.article.slug;

    // GET -  Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).shouldEqual(newArticleTitle);

    // Modify payload property to update existing article.
    articleRequestPayload.article.title = faker.lorem.sentence(10);
    const updatedArticleTitle = articleRequestPayload.article.title;

    // PUT - Update Article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body(articleRequestPayload)
        .putRequest(200)

    expect(updateArticleResponse.article.title).shouldEqual(updatedArticleTitle);
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

    expect(articlesResponse2).not.shouldEqual(updatedArticleTitle);
});


test('Create and delete Article with Faker Library', async ({ api }) => {
    // Generate a new random request payload with the faker implementation.
    const newArticleTitle = getNewRandomArticle();

    // POST - Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body(newArticleTitle)
        .postRequest(201)

    // Validate Schema   
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article', true);

    expect(createArticleResponse.article.title).shouldEqual(newArticleTitle.article.title);
    const slugId = createArticleResponse.article.slug;

    // GET - Assertion
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 2, offset: 0 })
        .getRequest(200);

    const articleTitle = articlesResponse.articles[0].title;
    expect(articleTitle).shouldEqual(newArticleTitle.article.title);

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

    expect(articlesResponse2).not.shouldEqual(newArticleTitle.article.title);
});