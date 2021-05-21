const router = require("express").Router();

const { User } = require("../models/Users");

router.get("/", async (req, res) => {
    const details = await User.findById(res.locals.details._id);
    res.send(details["funds"]);
});

module.exports = router;