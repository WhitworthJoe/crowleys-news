const { selectTopics, selectEndpoints, selectArticleById, selectCommentsByArticleId } = require("./model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints: endpoints });
    })
    .catch(next);
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};
