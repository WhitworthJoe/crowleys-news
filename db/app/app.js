const express = require("express");
const { getTopics, getArticlesById, getEndpoints } = require("./controller");
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors");

const app = express();

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
