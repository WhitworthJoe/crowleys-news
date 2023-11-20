const express = require("express");
const { getTopics } = require("./controller");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics)


app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
