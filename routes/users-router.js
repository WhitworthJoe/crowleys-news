const express = require("express");
const { getUsers, getUserByUsername } = require("../db/app/controller");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername)

module.exports = usersRouter;