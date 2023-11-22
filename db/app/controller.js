const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  selectArticles,
  updateArticleById, insertCommentByArticleId, removeCommentByCommentId,
  selectUsers,
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

exports.patchArticlesById = (req, res, next) => {
  const {article_id} = req.params;
  const {inc_votes} = req.body;
  updateArticleById(article_id, inc_votes)
  .then((updatedArticle) => {
    res.status(200).send(updatedArticle)
  })
  .catch(next)
}
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentPromises = [selectCommentsByArticleId(article_id)];
  if (article_id) {
    commentPromises.push(checkExists("articles", "article_id", article_id));
  }
  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertCommentByArticleId(article_id, newComment)
    .then((rows) => {
      res.status(201).send({ postedComment: rows });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};


exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
  .then(() => {
    res.status(204).send()
  })
  .catch(next)
}