const express = require("express");
const { getUsers } = require("../db/app/controller");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;