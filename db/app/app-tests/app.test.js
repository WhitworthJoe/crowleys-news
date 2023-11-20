const request = require("supertest");
const seed = require("../../seeds/seed");
const db = require("../../../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../../data/test-data");
require("jest-sorted");
const { app } = require("../app");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("GET /api/topics", () => {
  test("200: should return topic data with slug and description properties ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        const  {topics} = body
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
          
        });
      });
  });
});

describe('/api/articles/:article_id', () => {
  test('200: should return article data for specific article_id provided', () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body).toEqual([{
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String), // the Number from articles.js keeps converting to an actual string data - hopefully this is correct
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }])
    })
  });
  test('404: returns error for invalid article id NUMBER', () => {
    return request(app)
    .get('/api/articles/124124')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toEqual("invalid article id")
    })
  })
  test('400: returns error for invalid article id TYPE', () => {
    return request(app)
    .get('/api/articles/hello')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toEqual("Bad request")
    })
  })
});
