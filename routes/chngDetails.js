const router = require("express").Router();

const { User } = require("../models/Users");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).send("send all the required details.");
    const { name, password } = req.body;
    const updateObj = {};
    let responseMsg = "Name updated successfully";
    if (name)
        updateObj["name"] = name;
    if (password) {
        let salt = await bcrypt.genSalt(10);
        updateObj["password"] = await bcrypt.hash(password, salt);
        responseMsg = "Password updated successfully"
    }

    const update = await User.findByIdAndUpdate(res.locals.details._id, updateObj);

    res.send(responseMsg);
});

module.exports = router;