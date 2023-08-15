const db = require("../lib/db");
require("dotenv").config();

module.exports.createPost = (title, description, authorId, callback) => {
    sql = "INSERT into board set ?";

    newPost = {
        title: title,
        description: description,
        author_id: authorId,
    };

    db.query(sql, newPost, (err, result) => {
        if (err) callback(err);

        callback(null, { result: true, message: "Post Successfully" });
    });
};

module.exports.getPostList = (page, callback) => {
    sql =
        "SELECT b.title, b.description, b.created_at, u.email FROM board b INNER JOIN user u ON b.author_id = u._id ORDER BY b.created_at DESC LIMIT ?, ?";

    const postsPerPage = parseInt(process.env.POSTS_PER_PAGE);
    const limitOptions = [(page - 1) * postsPerPage, postsPerPage];

    db.query(sql, limitOptions, (err, result) => {
        if (err) callback(err);

        callback(null, { result: true, data: result });
    });
};
