const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { joinUser } = require("./controller/memberCont");

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

// 회원가입
// POST /user
router.route("/user").post(async (req, res) => {
    try {
        const result = await joinUser(req.body.email, req.body.password);

        if (result.result) {
            res.status(201).json();
        } else {
            res.status(405).json({ message: result.message });
        }
    } catch (error) {
        res.status(404).json({ message: "Unexpected Error" });
    }
});

app.use("/", router);

app.listen(port, () => {
    console.log(`Listen on ${port}`);
});
