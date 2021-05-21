const { verifyToken } = require("../models/Users");
const auth = (req, res, next) => {
    try {
        if (req.originalUrl === "/createAcc") {
            next();
        } else if (req.originalUrl === "/login") {
            if (req.headers["x-auth-token"] !== "null") {
                const details = verifyToken(req.headers["x-auth-token"]);
                res.locals.details = details;
                return res.send(req.headers["x-auth-token"]);
            }
            next();
        } else {
            const details = verifyToken(req.headers["x-auth-token"]);
            res.locals.details = details;
            next();
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).send("Please login again");
    }
}

module.exports = auth;