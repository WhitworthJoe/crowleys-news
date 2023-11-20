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
    console.log(data);
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
