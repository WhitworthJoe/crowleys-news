const express = require("express");
const {
  getCommentsByArticleId,
  deleteCommentByCommentId,
} = require("../db/app/controller");

const commentsRouter = express.Router();

commentsRouter.get("/:article_id/comments", getCommentsByArticleId);
commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter;