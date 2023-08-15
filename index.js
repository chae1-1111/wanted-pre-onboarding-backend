const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { joinUser, loginUser } = require("./controller/memberCont");

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
router.route("/user/signup").post(async (req, res) => {
    try {
        const result = await joinUser(req.body.email, req.body.password);

        if (result.result) {
            return res.status(201).json();
        } else {
            return res.status(405).json({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: "Unexpected Error" });
    }
});

// 로그인
// GET /user
router.route("/user/signin").post(async (req, res) => {
    loginUser(req.body.email, req.body.password, (err, result) => {
        if (err) return res.status(404).json({ message: "Unexpected Error" });

        if (result.result) {
            return res.status(200).json({ jwt: result.token });
        } else {
            return res.status(401).json({ message: result.message });
        }
    });
});

app.use("/", router);

app.listen(port, () => {
    console.log(`Listen on ${port}`);
});
