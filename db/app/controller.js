const { convertTimestampToDate } = require("../seeds/utils");
const {
  selectTopics,
  selectEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  selectArticles,
  updateArticleById,
  insertCommentByArticleId,
  removeCommentByCommentId,
  selectUsers,
  selectArticlesByTopic,
  selectArticlesSortOrder,
  selectArticlesSort,
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
  const { topic, sort_by, order } = req.query;
  const validSorts = ["title", "topic", "author", "created_at", "votes"];
  const validOrders = ["asc", "desc"];

  if (req.query.hasOwnProperty("topic")) {
    selectArticlesByTopic(topic)
      .then((TopicArticles) => {
        res.status(200).send(TopicArticles);
      })
      .catch(next);
  } else if (
    req.query.hasOwnProperty("sort_by") &&
    req.query.hasOwnProperty("order")
  ) {
    selectArticlesSortOrder(sort_by, order, validSorts, validOrders)
      .then((sortedOrderedArticles) => {
        res.status(200).send(sortedOrderedArticles);
      })
      .catch(next);
  } else if (req.query.hasOwnProperty("sort_by")) {
    selectArticlesSort(sort_by, validSorts)
      .then((sortedArticles) => {
        res.status(200).send(sortedArticles);
      })
      .catch(next);
  }  else if (req.query.hasOwnProperty('order') && !req.query.hasOwnProperty('sort_by')) {
    res.status(400).json({ msg: "invalid search parameter" });
  } else {
    selectArticles()
      .then((articles) => {
        res.status(200).send(articles);
      })
      .catch(next);
  }
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
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};
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
      res.status(204).send();
    })
    .catch(next);
};
