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

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((data) => {

      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid article id" });
      }
      return data.rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(`SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;`, [article_id])
  .then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "invalid article id" });
    }
    return rows
  })
}
