const router = require("express").Router();

const { User, generateToken } = require("../models/Users");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).send("send all the required details.");
    // const user = await User.findOne({ email: req.body.email, password: req.body.password });
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Incorrect email or password");
    let passCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!passCorrect)
        return res.status(400).send("Incorrect email or password");
    const payload = { email: user.email, name: user.name, _id: user._id };
    const token = generateToken(payload);
    return res.send(token);

});


module.exports = router;