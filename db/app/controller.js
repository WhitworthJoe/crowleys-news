const { selectTopics, selectEndpoints, selectArticleById } = require("./model")

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints: endpoints})
    })
    .catch(next)
}

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
