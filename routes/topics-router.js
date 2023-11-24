const express = require("express");
const { getTopics } = require("../db/app/controller");

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;