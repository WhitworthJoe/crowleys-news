const express = require("express");
const { getTopics, getEndpoints } = require("./controller");

const app = express();

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

module.exports = { app };
