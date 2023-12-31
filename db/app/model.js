const db = require("../../db/connection");
const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../../endpoints.json`)
    .then((fileContents) => {
      const endpoints = JSON.parse(fileContents);
      return endpoints;
    });
};

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
};

exports.insertTopic = ({ slug, description }) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "bad request. Missing required information",
    });
  }
  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({
      status: 400,
      msg: "bad request. Invalid character type",
    });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )
    .then((insertedTopic) => {
      return insertedTopic.rows[0];
    });
};

exports.selectArticles = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC LIMIT $1 OFFSET $2;`;
  return db.query(query, [limit, offset]).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({status: 404, msg: "page doesn't exist"})
    }
    return data.rows;
  });
};

exports.insertArticle = ({ author, title, body, topic, article_img_url }) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: "bad request. Missing required information",
    });
  }
  const default_img_url =
    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";
  const image_url = article_img_url || default_img_url;
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [author, title, body, topic, image_url]
    )
    .then((data) => {
      const insertedArticle = data.rows[0];
      return db
        .query(
          "SELECT COUNT(comment_id)::INT AS comment_count FROM comments WHERE article_id = $1",
          [insertedArticle.article_id]
        )
        .then((CountData) => {
          const commentCount = CountData.rows[0].comment_count;
          return { ...insertedArticle, comment_count: commentCount };
        });
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid article id" });
      }
      return data.rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return db
    .query(
      `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC LIMIT $2 OFFSET $3;`,
      [article_id, limit, offset]
    )
    .then(({ rows }) => {
      if (rows.length === 0 && page > 1) {
        return Promise.reject({status:404, msg:"No comments found on this page"})
      }
      return rows;
    });
}; // need to add some code for 1. if article_id doesn't exist and 2. if pages out-of-range

exports.insertCommentByArticleId = (article_id, newComment) => {
  const { username, body } = newComment;
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Username and Body are required",
    });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then((data) => {
      return data.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((data) => {
    return data.rows;
  });
};

exports.updateArticleById = (article_id, updateData) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *;`,
      [updateData, article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid article id" });
      }
      return data.rows[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return data.rows;
    });
};

exports.selectArticlesByTopic = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then((topicData) => {
      if (topicData.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "topic does not exist" });
      }
      return db
        .query(`SELECT * FROM articles WHERE topic = $1;`, [topic])
        .then((articleData) => {
          return articleData.rows;
        });
    });
};

exports.selectArticlesSortOrder = (sort_by, order, validSorts, validOrders) => {
  if (!validSorts.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid search parameter" });
  }
  return db
    .query(`SELECT * FROM articles ORDER BY ${sort_by} ${order}`)
    .then((sortedOrderedData) => {
      return sortedOrderedData.rows;
    });
};

exports.selectArticlesSort = (sort_by, validSorts) => {
  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid search parameter" });
  }
  return db
    .query(`SELECT * FROM articles ORDER BY ${sort_by} DESC`)
    .then((sortedData) => {
      return sortedData.rows;
    });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((users) => {
      if (users.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      }
      return users.rows[0];
    });
};

exports.updatesCommentByCommentId = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then((updatedCommment) => {
      if (updatedCommment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
      return updatedCommment.rows[0];
    });
};
