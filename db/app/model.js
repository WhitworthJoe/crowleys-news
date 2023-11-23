const { nextTick } = require("process");
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

exports.selectArticles = () => {
  const query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
  return db.query(query).then((data) => {
    return data.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid article id" });
      }
      return data.rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

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
  return db.query(`SELECT * FROM users;`)
  .then((data) => {
    return data.rows
  })
}

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
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
  .then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({status: 404, msg: "Comment does not exist"})
    }
    return data.rows
  })
}