const router = require("express").Router();

const Coins = require("../models/Coins");

router.get("/", async (req, res) => {
    const coinsList = await Coins.find({});

    res.send(coinsList);
});

module.exports = router;