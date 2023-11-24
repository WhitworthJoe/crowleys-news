const express = require("express");
const {
  getArticles,
  getArticlesById,
  postCommentByArticleId,
  patchArticlesById,
  getCommentsByArticleId,
  postArticle,
} = require("../db/app/controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle)
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId)
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticlesById);

module.exports = articlesRouter;