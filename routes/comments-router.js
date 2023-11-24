const express = require("express");
const {
  getCommentsByArticleId,
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("../db/app/controller");

const commentsRouter = express.Router();

commentsRouter.get("/:article_id/comments", getCommentsByArticleId);
commentsRouter.patch("/:comment_id", patchCommentByCommentId)
commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter;