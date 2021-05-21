const router = require("express").Router();

const { User, generateToken } = require("../models/Users");
const bcrypt = require("bcrypt");

const coinlist = ["BTC", "YFI", "ATOM", "UNI", "LTC", "BNB", "LINK", "ETH", "XRP", "WAVES", "DOGE", "TRX", "TOMO", "YFII"];


router.post("/", async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).send("send all the required details.");
    const { name, email } = req.body;
    let { password } = req.body;

    const ExistingUser = await User.findOne({ email });
    if (ExistingUser)
        return res.status(400).send("User with this email already exists.");

    const fundList = {};
    coinlist.forEach(coin => {
        fundList[coin] = 0;
        fundList["USDT"] = 1000;
    });

    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password,
        funds: fundList
    });
    const user = await newUser.save();
    const token = generateToken({ name: user.name, _id: user._id, email: user.email });
    return res.send(token);
});

module.exports = router;