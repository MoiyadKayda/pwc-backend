// const io = require("socket.io-client");
// const socket = io("http://localhost:3000/");

// socket.emit("getTrade", "YFI");
// socket.on("ticker", data => console.log(data));

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://node-user:Abc123456@sandbox.h8vkg.mongodb.net/pwc?retryWrites=true&w=majority")
    .then(() => console.log("Connected to Database"))
const Coins = require("./models/Coins");

const createCoins = (name, symbol) => {
    return ({ name, symbol });
};
async function addCoins() {
    try {

        const res = await Coins.insertMany([createCoins("Bitcoin", "BTC"),
        createCoins("Yearn Finance", "YFI"),
        createCoins("Cosmos", "ATOM"),
        createCoins("Uniswap", "UNI"),
        createCoins("LiteCoin", "LTC"),
        createCoins("Binance Coin", "BNB"),
        createCoins("Chainlink", "LINK"),
        createCoins("Ethereum", "ETH"),
        createCoins("Ripple", "XRP"),
        createCoins("Waves", "WAVES"),
        createCoins("Dogecoin", "DOGE"),
        createCoins("Tron", "TRX"),
        createCoins("Tomochain", "TOMO"),
        createCoins("DFI.Money", "YFII")
        ]);

        // console.log(res);
    } catch (ex) { /*console.log(ex);*/ }
}

addCoins()