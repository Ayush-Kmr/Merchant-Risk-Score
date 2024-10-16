require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const logger = require("morgan");
const bodyParser = require("body-parser");

const server = require("http").createServer(app);

require("./config/database.js");

app.use(logger("dev"));

app.use(bodyParser.json());

app.disable("etag");

app.use("/api/v1/", indexRouter);

const port = 8000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
