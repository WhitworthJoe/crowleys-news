const db = require("../../db/connection");

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
