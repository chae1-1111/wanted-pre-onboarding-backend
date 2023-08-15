const db = require("../lib/db");

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
