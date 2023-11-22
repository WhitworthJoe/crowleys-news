const express = require("express");
const {
  getTopics,
  getArticlesById,
  getEndpoints,
  getArticles,
  postCommentByArticleId,
  getCommentsByArticleId,
  patchArticlesById, 
  deleteCommentByCommentId, 
  getUsers} = require("./controller");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");


const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticlesById);app.delete("/api/comments/:comment_id", deleteCommentByCommentId)
app.get("/api/users", getUsers)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
