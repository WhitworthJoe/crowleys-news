const express = require("express");
const { getTopics, postTopic } = require("../db/app/controller");

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic)

module.exports = topicsRouter;