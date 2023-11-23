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

describe("GET /api/articles/:article_id", () => {
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
            comment_count: 11
          },
        ]);
        expect(body[0].comment_count).toBeDefined()
        expect(typeof body[0].comment_count).toBe("number")

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

describe("GET /api/articles", () => {
  test("200: Should return an array of all article objects with multiple properties, sorted by date and no body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(13);
        expect(body).toBeSortedBy("created_at", { coerce: true });
        body.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return a sorted array of all comments for specified article via the article_id, with the most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).not.toEqual({});
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: should return an empty array when there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("404: returns error for valid article id but does NOT exist", () => {
    return request(app)
      .get("/api/articles/124124/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No comments for this article");
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Should add new comment to specified article_id and return it", () => {
    const newComment = {
      username: "rogersop",
      body: "this is an example of the body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body;
        expect(postedComment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "rogersop",
          body: "this is an example of the body",
          article_id: 1,
        });
      });
  });
  test("201: Should add new comment to specified article_id and return it, ignoring unnecessary properties", () => {
    const newComment = {
      username: "rogersop",
      body: "this is an example of the body",
      unnecessaryProperty: "should be ignored",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body;
        expect(postedComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "rogersop",
          body: "this is an example of the body",
          article_id: 1,
        });
        expect(postedComment).not.toHaveProperty("unnecessaryProperty");
      });
  });
  test("400: returns error username or body property is missing in request", () => {
    const newComment = {
      username: "itzCrowley",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request. Username and Body are required");
      });
  });
  test("404: returns error if username does not exist in the database", () => {
    const newComment = {
      username: "itzCrowley",
      body: "I am always living in the shadow of a great man, my father Joe, so I relate to this article",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
  test("400: returns error if valid article ID but does not exist", () => {
    const newComment = {
      username: "rogersop",
      body: "this is an example of the body",
    };
    return request(app)
      .post("/api/articles/1523523/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("400: returns error if invalid article id", () => {
    const newComment = {
      username: "rogersop",
      body: "this is an example of the body",
    };
    return request(app)
      .post("/api/articles/hello/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates an existing articles votes based on article id and returns updated article", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: 150 })
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 250,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: update works as above with negative inv_votes", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: -150 })
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: -50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: returns error for an invalid patch article ID character type (expects Numbers, not String)", () => {
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: "fifty" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: returns error for a valid article ID but does not exist", () => {
    return request(app)
      .patch(`/api/articles/666`)
      .send({ inc_votes: 500 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid article id");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: removes an existing comment by id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test(`404: returns error for valid comment id but does not exist`, () => {
    return request(app)
      .delete("/api/comments/666")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment does not exist");
      });
  });
  test("400: returns error for invalid comment id", () => {
    return request(app)
      .delete("/api/comments/crowley")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Should return an array of user objects with 3 properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles?topic=topic", () => {
  test("200: Should return an array of articles matching the topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeDefined();
        expect(articles).toHaveLength(1);
        expect(articles[0]).toMatchObject({
          article_id: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          votes: 0,
        });
      });
  });
  test('400: returns error if topic does not exist', () => {
    return request(app)
    .get('/api/articles?topic=crowley')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("topic does not exist")
    })
  });
  test('400: returns error if topic is ommitted', () => {
    return request(app)
    .get('/api/articles?topic=')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("topic does not exist")
    })
  });
});
