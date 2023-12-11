const express = require("express");
const apiRouter = require("../../routes/api-router");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");
const cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app };
