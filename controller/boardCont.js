const db = require("../lib/db");
require("dotenv").config();

module.exports.createPost = (title, description, authorId, callback) => {
    let sql = "INSERT into board set ?";

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
    let sql =
        "SELECT b._id, b.title, b.created_at, u.email FROM board b INNER JOIN user u ON b.author_id = u._id ORDER BY b.created_at DESC LIMIT ?, ?";

    const postsPerPage = parseInt(process.env.POSTS_PER_PAGE); //10
    const limitOptions = [(page - 1) * postsPerPage, postsPerPage];

    db.query(sql, limitOptions, (err, result) => {
        if (err) callback(err);

        callback(null, { result: true, data: result });
    });
};

module.exports.getOnePost = (_id, callback) => {
    let sql =
        "SELECT b.title, b.description, b.created_at, u.email FROM board b INNER JOIN user u ON b.author_id = u._id WHERE b._id = ?";

    db.query(sql, [_id], (err, result) => {
        if (err) callback(err);

        callback(null, result);
    });
};

module.exports.modifyPost = (_id, postData, authorId, callback) => {
    let sql = "SELECT author_id FROM board WHERE _id = ?";

    db.query(sql, [_id], (err, result) => {
        if (err) callback(err);

        if (result.length === 0) {
            callback(null, { result: 404, message: "Post doesn't exist" });
        } else if (result[0].author_id != authorId) {
            callback(null, {
                result: 401,
                message: "Authentication Failed",
            });
        } else {
            sql = "UPDATE board SET ? WHERE _id = ? AND author_id = ?";
            values = [postData, _id, authorId];

            db.query(sql, values, (err, result) => {
                if (err) callback(err);

                console.log(result);

                if (result.affectedRows === 1) {
                    callback(null, { result: 201 });
                } else {
                    callback(new Error("Unexpected Error"));
                }
            });
        }
    });
};

module.exports.deletePost = (_id, authorId, callback) => {
    let sql = "SELECT author_id FROM board WHERE _id = ?";

    db.query(sql, [_id], (err, result) => {
        if (err) callback(err);

        if (result.length === 0) {
            callback(null, { result: 404, message: "Post doesn't exist" });
        } else if (result[0].author_id != authorId) {
            callback(null, {
                result: 401,
                message: "Authentication Failed",
            });
        } else {
            sql = "DELETE FROM board WHERE _id = ? AND author_id = ?";

            db.query(sql, [_id, authorId], (err, result) => {
                if (err) callback(err);

                if (result.affectedRows === 1) {
                    callback(null, { result: 201 });
                } else {
                    callback(new Error("Unexpected Error"));
                }
            });
        }
    });
};
