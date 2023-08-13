const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

const router = express.Router();

router.route("/").get((req, res) => {
  res.write("Hello, world!");
  res.end();
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Listen on ${port}`);
});
