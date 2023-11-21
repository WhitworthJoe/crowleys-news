const express = require("express");
const { getTopics, getArticlesById, getEndpoints, getCommentsByArticleId } = require("./controller");
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors");

const app = express();

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
