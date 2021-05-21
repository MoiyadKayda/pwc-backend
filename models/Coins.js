const mongoose = require("mongoose");

const coinList = new mongoose.Schema({
    name: String,
    symbol: String
});

const CoinList = mongoose.model("CoinList" , coinList);

module.exports = CoinList;