const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const user = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    funds: Object
});

const User = mongoose.model("user", user);

const generateToken = (userDetails) => {
    const token = jwt.sign(userDetails, process.env.JWT_TOKEN);
    return token;
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        return decoded;
    } catch (ex) {
        throw ex.message;
    }
}

module.exports.User = User;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;