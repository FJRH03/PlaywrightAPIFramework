import { test, expect } from '@playwright/test';

let token: string;

test.beforeAll('run before all', async ({ request }) => {
  const payload = { "user": { "email": "franktest@test.com", "password": "Test1234" } };
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', { data: payload });
  const responseJSON = await response.json();
  token = 'Token ' + responseJSON.user.token;
});

test('Get Test Tags', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const responseJSON = await response.json();
  let youtubeTag = responseJSON.tags[3]

  // Validations
  expect(response.status()).toEqual(200);
  expect(youtubeTag).toEqual("YouTube");
  expect(responseJSON.tags.length).toBeLessThanOrEqual(10);
});


test('Get all articles', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=2&offset=0');
  const responseJSON = await response.json();
  let slugId = responseJSON.articles[0].slug;

  // Validaitons
  expect(response.status()).toEqual(200);
  expect(slugId).toEqual('Discover-Bondar-Academy:-Your-Gateway-to-Efficient-Learning-1');
  expect(responseJSON.articles.length).toBeLessThanOrEqual(10);
});


test('Create and Delete article', async ({ request }) => {
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

  // Requires: URI, {data: <data{}>, headers: <Authorization: <token> }
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', { data: articlePayload, headers: { Authorization: token } });
  const newArticleResponseJSON = await newArticleResponse.json();

  // Assertions
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual('New Test');

  // Get the articles once again and validate is listed.
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=2&offset=0', {headers: { Authorization: token }}) ;
  const articlesJSON = await articlesResponse.json();
  const slug = articlesJSON.articles[0].slug;

  // Assertions POST creation of the article.
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesJSON.articles[0].title).toEqual('New Test');

  // Delete article recently created
  const deleteArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`, {headers: { Authorization: token } });
  expect(deleteArticle.status()).toEqual(204);
});


test('Create, Update and Delete article', async ({ request }) => {
  // Create article body payload.
  const articlePayload = {
    "article":
    {
      "title": "Frank Test",
      "description": "This is a Frank Test",
      "body": "This is a description for frank test",
      "tagList": []
    }
  };

  // Requires: URI, {data: <data{}>, headers: <Authorization: <token> }
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', { data: articlePayload, headers: { Authorization: token } });
  const newArticleResponseJSON = await newArticleResponse.json();

  // Assertions
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual('Frank Test');

  // Get the articles once again and validate is listed.
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=2&offset=0', {headers: { Authorization: token }}) ;
  const articlesJSON = await articlesResponse.json();
  const slug = articlesJSON.articles[0].slug;

  // Assertions POST creation of the article.
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesJSON.articles[0].title).toEqual('Frank Test');

  // Update Article
  // Create article body payload.
  const updateArticlePayload = {
    "article":
    {
      "title": "Frank Test 2",
      "description": "This is a Frank Test 2",
      "body": "This is a description for frank test 2",
      "tagList": []
    }
  };

  // Requires: URI, {data: <data{}>, headers: <Authorization: <token> }
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slug}`, { data: updateArticlePayload, headers: { Authorization: token } });
  const updateArticleResponseJSON = await updateArticleResponse.json();
  console.log(updateArticleResponseJSON.article.slug);
  const updatedSlug = updateArticleResponseJSON.article.slug;

  // Assertions PUT creation of the article.
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJSON.article.title).toEqual('Frank Test 2');

  // Delete article recently created
  const deleteArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedSlug}`, {headers: { Authorization: token } });
  expect(deleteArticle.status()).toEqual(204);
});