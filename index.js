const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { joinUser, loginUser } = require("./controller/memberCont");
const {
    createPost,
    getPostList,
    getOnePost,
    modifyPost,
    deletePost,
} = require("./controller/boardCont");
const jwt = require("jsonwebtoken");

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
// POST /user/signup
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
// POST /user/signin
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

// 게시글 작성
// POST /board
router.route("/board").post((req, res) => {
    verifyToken(req, (err, result) => {
        if (err)
            return res.status(401).json({ message: "Authentication Failed" });

        const { title, description } = req.body;

        createPost(title, description, result._id, (err, result) => {
            if (err)
                return res.status(404).json({ message: "Unexpected Error" });

            return res.status(201).json();
        });
    });
});

// 게시글 목록 조회
// GET /board
router.route("/board").get((req, res) => {
    const page = req.query.page;

    getPostList(page, (err, result) => {
        if (err) return res.status(404).json({ message: "Unexpected Error" });

        return res.status(200).json({ posts: result });
    });
});

// 게시글 상세 조회
// GET /board/:_id
router.route("/board/:_id").get((req, res) => {
    const _id = req.params._id;

    getOnePost(_id, (err, result) => {
        if (err) return res.status(404).json({ message: "Unexpected Error" });

        if (result.length === 0)
            return res.status(404).json({ message: "Post doesn't exist" });

        return res.status(200).json({ post: result[0] });
    });
});

// 게시글 수정
// PATCH /board/:_id
router.route("/board/:_id").patch((req, res) => {
    verifyToken(req, (err, result) => {
        if (err)
            return res.status(401).json({ message: "Authentication Failed" });

        const _id = req.params._id;
        const postData = {};
        if (req.body.title) postData.title = req.body.title;
        if (req.body.description) postData.description = req.body.description;
        console.log(postData);
        const authorId = result._id;

        modifyPost(_id, postData, authorId, (err, result) => {
            if (err)
                return res.status(404).json({ message: "Unexpected Error" });

            if (result.result !== 201) {
                return res
                    .status(result.result)
                    .json({ message: result.message });
            }
            return res.status(201).json({});
        });
    });
});

// 게시글 삭제
// DELETE /board/:_id
router.route("/board/:_id").delete((req, res) => {
    verifyToken(req, (err, result) => {
        if (err)
            return res.status(401).json({ message: "Authentication Failed" });

        const _id = req.params._id;
        const authorId = result._id;

        deletePost(_id, authorId, (err, result) => {
            if (err)
                return res.status(404).json({ message: "Unexpected Error" });

            if (result.result !== 201) {
                return res
                    .status(result.result)
                    .json({ message: result.message });
            }
            return res.status(201).json({});
        });
    });
});

const verifyToken = (req, callback) => {
    const auth = req.headers.authorization;

    if (!auth) {
        const err = new Error("Authentication Failed");
        callback(err);
    } else {
        const token = auth.includes("Bearer ")
            ? auth.split("Bearer ")[1]
            : auth;

        try {
            const result = jwt.verify(token, process.env.JWT_SECRET_KEY);
            callback(null, result);
        } catch (err) {
            callback(err);
        }
    }
};

app.use("/", router);

app.listen(port, () => {
    console.log(`Listen on ${port}`);
});
