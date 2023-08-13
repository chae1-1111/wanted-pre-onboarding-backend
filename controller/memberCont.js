const crypto = require("crypto");
const db = require("../lib/db");
const util = require("util");

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

module.exports.joinUser = async (email, password) => {
    if (!emailCheck(email)) {
        return { result: false, message: "Email invalid" };
    } else if (!passwordCheck(password)) {
        return { result: false, message: "Password invalid" };
    }

    encrypted = await encryptPassword(password);

    const sql = "insert into user set ?;";

    newUser = {
        email: email,
        password: encrypted.encryptedPassword,
        salt: encrypted.salt,
    };

    db.query(sql, newUser, (err, result) => {
        if (err) throw err;
    });

    return { result: true, message: "" };
};

module.exports.loginUser = (email, password) => {};

const emailCheck = (email) => {
    return email.indexOf("@") !== -1;
};

const passwordCheck = (password) => {
    return password.length >= 8;
};

const getSalt = async () => {
    const buf = await randomBytesPromise(64);

    return buf.toString("base64");
};

const encryptPassword = async (password) => {
    const salt = await getSalt();

    const key = await pbkdf2Promise(password, salt, 102934, 64, "sha512");

    encryptedPassword = key.toString("base64");

    return { encryptedPassword, salt };
};
