const request = require("supertest");
const seed = require("../../seeds/seed");
const db = require("../../../db/connection");
const endpoints = require("../../../endpoints.json");
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
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("200: should return a description of all other avaliable endpoints with specific endpoints present in data response", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ endpoints: expect.any(Object) });
        Object.entries(endpoints).forEach(([endpoint]) => {
          expect(endpoints[endpoint]).toBeDefined();
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200: should return article data for specific article_id provided", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  test("404: returns error for valid article id but does NOT exist", () => {
    return request(app)
      .get("/api/articles/124124")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("invalid article id");
      });
  });
  test("400: returns error for invalid article_id", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200: should return a sorted array of all comments for specified article via the article_id, with the most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body
        expect(comments).toBeSortedBy("created_at", {descending: true})
        comments.forEach((comment) => {
          expect(comment).toMatchObject(
            {
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            },
          );
        });
      });
  });
  test("404: returns error for valid article id but does NOT exist", () => {
    return request(app)
      .get("/api/articles/124124/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("invalid article id");
      });
  });
  test("400: returns error for invalid article_id", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
