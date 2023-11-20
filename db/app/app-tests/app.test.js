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
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("200: should return an array of all topics within the databse", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        const {topics} = body
        expect(topics).toHaveLength(3);
        expect(typeof topics).toBe("object")
      });
  })
});
