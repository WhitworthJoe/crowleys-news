const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  selectArticles,
} = require("./model");
const { checkExists } = require("./utils");

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

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send(articles);
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
  const commentPromises = [selectCommentsByArticleId(article_id)];
  if (article_id) {
    commentPromises.push(checkExists("comments", "article_id", article_id));
  }
  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

