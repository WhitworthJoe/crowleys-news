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
        expect(body).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
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
  test("200: Should return article data for specified article id and include a count of comments relating to the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
        expect(body.comment_count).toBeDefined();
        expect(typeof body.comment_count).toBe("number");
      });
  });
  test("200: Should return article data for specified article id and include a count of comments relating to the article if count = 0", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
        expect(body.comment_count).toBeDefined();
        expect(typeof body.comment_count).toBe("number");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Should return an array of all article objects with multiple properties, sorted by date and no body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(10);
        expect(body).toBeSortedBy("created_at", { descending: true });
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

describe("POST /api/articles", () => {
  test("201: Should add new and return a new article to the database", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "I am a cat.",
      body: "Since my last article I have in fact, in all forms except physical, become a cat.",
      topic: "cats",
      article_img_url:
        "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201601/cat---facebook-and-storysize_647_011416045855.jpg?VersionId=KAuIu37rc1PK1216UEQ0naVgpgHaM5kb&size=690:388",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { postedArticle } = body;
        expect(postedArticle).toMatchObject({
          article_id: 14,
          author: "icellusedkars",
          title: "I am a cat.",
          body: "Since my last article I have in fact, in all forms except physical, become a cat.",
          topic: "cats",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201601/cat---facebook-and-storysize_647_011416045855.jpg?VersionId=KAuIu37rc1PK1216UEQ0naVgpgHaM5kb&size=690:388",
          comment_count: 0,
        });
      });
  });
  test("201: Should add new and return a new article to the database with defaulted article_img_url", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "I am a cat.",
      body: "Since my last article I have in fact, in all forms except physical, become a cat.",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { postedArticle } = body;
        expect(postedArticle).toMatchObject({
          article_id: 14,
          author: "icellusedkars",
          title: "I am a cat.",
          body: "Since my last article I have in fact, in all forms except physical, become a cat.",
          topic: "cats",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("201: Should add new article and return it, ignoring unnecessary properties", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "I am a cat.",
      body: "Since my last article I have in fact, in all forms except physical, become a cat.",
      topic: "cats",
      favouriteCat: "Crowley",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { postedArticle } = body;
        expect(postedArticle).toMatchObject({
          article_id: 14,
          author: "icellusedkars",
          title: "I am a cat.",
          body: "Since my last article I have in fact, in all forms except physical, become a cat.",
          topic: "cats",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("400: returns error if any required properties are missing in the request", () => {
    const newArticle = {
      author: "icellusedkars",
      body: "Oh wait, I forgot to add a title!!",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request. Missing required information");
      });
  });
  test("404: returns error if topic does not exist within database", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "I cant stand them dogs since becoming a cat",
      body: "Do dogs even have thoughts in their heads? Not like us cats!",
      topic: "dogs",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
  test("404: returns error if author username does not exist within database", () => {
    const newArticle = {
      author: "itzCrowley",
      title: "Yo its me, ya boy",
      body: "Im just coming here to say Hi, I havent even made an account yet, isn't it cool I can still post!",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
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
  test("400: returns error for an invalid patch inc_votes character type (expects Numbers, not String)", () => {
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

describe("PATCH /api/comments/:comment_id", () => {
  test("200: updates the existing votes property with positive votes on the comment specified by comment id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 666 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 682,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
          comment_id: 1,
        });
      });
  });
  test("200: updates the existing votes property with negative votes on the comment specified by comment id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -666 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: -650,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
          comment_id: 1,
        });
      });
  });
  test("400: return an error for invalid inc_votes character type (expects Numbers, not String)", () => {
    return request(app)
      .patch(`/api/comments/1`)
      .send({ inc_votes: "fifty" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: returns error for a valid comment ID but does not exist)", () => {
    return request(app)
      .patch(`/api/comments/666`)
      .send({ inc_votes: 666 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
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

describe("GET /api/users/:username", () => {
  test("200: Should return user details specified by username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
        expect(users).toHaveProperty("username");
        expect(users).toHaveProperty("avatar_url");
        expect(users).toHaveProperty("name");
      });
  });
  test("404: returns an error if username is not found", () => {
    return request(app)
      .get("/api/users/NotAUsername")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
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
  test("400: returns error if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=crowley")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
  test("400: returns error if topic is ommitted", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
  test("400: returns error if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=crowley")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
  test("200: Should return an empty array due to there being no articles under the topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(0);
        expect(body).toEqual([]);
      });
  });
});

describe("GET /api/articles?sort_by=created_at&order=desc", () => {
  test("200: Should return an array of articles sorted as specified, in default DESC order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Should return an array of articles sorted and in ascending order as specified", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("title", { descending: false });
      });
  });
  test("400: Should return an error if sent an invalid sort_by parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=notValidSort")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid search parameter");
      });
  });
  test("400: Should return an error if sent an invalid order parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=upsideDown")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid search parameter");
      });
  });
  test("400: Should return an error if sent an invalid sort_by AND order parameter", () => {
    return request(app)
      .get("/api/articles?sort_by=notValidSort&order=upsideDown")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid search parameter");
      });
  });
  test("400: Should return an error if sent an invalid sort_by AND order parameter", () => {
    return request(app)
      .get("/api/articles?order=upsideDown")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid search parameter");
      });
  });
});

describe("GET /api/articles?page=page&limit=limit", () => {
  test("200: should return an array of paginated articles ", () => {
    return request(app)
      .get("/api/articles?page=1&limit=10")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toHaveLength(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
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
          expect(articles).not.toHaveProperty("body");
        });
      });
  });
  test("200: should return the second page of articles", () => {
    return request(app)
      .get("/api/articles?page=2&limit=10")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toHaveLength(3);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
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
          expect(articles).not.toHaveProperty("body");
        });
      });
  });
  test("404: return error for pages out-of-range", () => {
    return request(app)
      .get("/api/articles?page=100&limit=10")
      .expect(404)
      .then(({ body }) => {
        const articles = body;
        expect(articles.msg).toBe("page doesn't exist");
      });
  });
  test("400: return error for invalid page parameters", () => {
    return request(app)
      .get("/api/articles?page=-1&limit=10")
      .expect(400)
      .then(({ body }) => {
        const articles = body;
        expect(articles.msg).toBe("page doesn't exist");
      });
  });
});

describe("GET /api/articles/:article_id/comments?page=page&limit=limit", () => {
  test("200: should return an array of paginated comments from the specified article_id ", () => {
    return request(app)
      .get("/api/articles/1/comments?page=1&limit=10")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(10);
        comments.forEach((comment) => {
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
  test("200: should return the second page of comments relating to specified article", () => {
    return request(app)
      .get("/api/articles/1/comments?page=2&limit=10")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(1);
        comments.forEach((comment) => {
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
  test("404: return error for pages out-of-range", () => {
    return request(app)
      .get("/api/articles/100/comments?page=100&limit=10")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments for this article");
      });
  });
  test("400: return error for invalid page parameters", () => {
    return request(app)
      .get("/api/articles/1/comments?page=-1&limit=10")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("page doesn't exist");
      });
  });
});

describe("POST /api/topics", () => {
  test("201: Should add new topic object with a topic name and description", () => {
    const newTopic = {
      slug: "biscuits",
      description:
        "Discussion of biscuits only, no one mention jaffa cakes, we aren't getting in to that right now",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { postedTopic } = body;
        expect(postedTopic).toMatchObject({
          slug: "biscuits",
          description:
            "Discussion of biscuits only, no one mention jaffa cakes, we aren't getting in to that right now",
        });
      });
  });
  test("201: Should add new topic ignoring unnecessary properties", () => {
    const newTopic = {
      slug: "biscuits",
      description:
        "Discussion of biscuits only, no one mention jaffa cakes, we aren't getting in to that right now",
      rules: "NO TALKING ABOUT JAFFA CAKES I WONT SAY IT AGAIN",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { postedTopic } = body;
        expect(postedTopic).toMatchObject({
          slug: "biscuits",
          description:
            "Discussion of biscuits only, no one mention jaffa cakes, we aren't getting in to that right now",
        });
      });
  });
  test("400: returns error if slug or description is missing in the request", () => {
    const newTopic = {
      slug: "cheese",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request. Missing required information");
      });
  });
  test("400: returns error if invalid character type given for slug or description", () => {
    const newTopic = {
      slug: 123,
      description: "numbers!"
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request. Invalid character type");
      });
  });
});
