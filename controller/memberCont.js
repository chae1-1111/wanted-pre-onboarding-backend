const crypto = require("crypto");
const db = require("../lib/db");
const util = require("util");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const ENC_ITERATIONS = parseInt(process.env.ENC_ITERATIONS);

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

module.exports.loginUser = async (email, password, callback) => {
    if (!emailCheck(email)) {
        return { result: false, message: "Email invalid" };
    } else if (!passwordCheck(password)) {
        return { result: false, message: "Password invalid" };
    }

    getUser(email, async (err, result) => {
        if (err) callback(err);

        if (result) {
            const verified = await verifyPassword(
                password,
                result.salt,
                result.password
            );

            if (verified) {
                const newToken = getJWT(result._id, email);

                callback(null, { result: true, token: newToken });
            } else {
                callback(null, {
                    result: false,
                    message: "No matched user found.",
                });
            }
        } else {
            callback(null, {
                result: false,
                message: "No matched user found.",
            });
        }
    });
};

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

    const key = await pbkdf2Promise(
        password,
        salt,
        ENC_ITERATIONS,
        64,
        "sha512"
    );

    encryptedPassword = key.toString("base64");

    return { encryptedPassword, salt };
};

const getUser = (email, callback) => {
    sql = "SELECT _id, password, salt from user WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) callback(err);

        if (result.length <= 0) {
            callback(null, null);
        } else {
            callback(null, {
                _id: result[0]._id,
                password: result[0].password,
                salt: result[0].salt,
            });
        }
    });
};

const verifyPassword = async (password, salt, encryptedPassword) => {
    const key = await pbkdf2Promise(
        password,
        salt,
        ENC_ITERATIONS,
        64,
        "sha512"
    );

    return key.toString("base64") === encryptedPassword;
};

const getJWT = (_id, email) => {
    const payload = {
        _id: _id,
        email: email,
    };

    const option = {
        algorithm: process.env.JWT_ALGORITHM,
        expiresIn: process.env.JWT_EXPIRATION,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, option);

    return token;
};
