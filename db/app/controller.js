const { selectTopics, selectEndpoints, selectArticleById, selectArticles, updateArticleById } = require("./model")

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

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send(articles)
    })
    .catch(next)
}

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch(next);
};

exports.patchArticlesById = (req, res, next) => {
  const {article_id} = req.params;
  const {inc_votes} = req.body;
  updateArticleById(article_id, inc_votes)
  .then((updatedArticle) => {
    res.status(200).send(updatedArticle)
  })
  .catch(next)
}