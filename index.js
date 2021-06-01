const express = require("express");
const app = express();
const server = require('http').createServer(app);
const Websocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const auth = require("./middleware/auth");
const coinList = require("./routes/coinList");
const funds = require("./routes/funds");
const createAcc = require("./routes/createAcc");
const login = require("./routes/login");
const placeOrder = require("./routes/placeOrder");
const chngDetails = require("./routes/chngDetails");



mongoose.connect(process.env.MongoDBURL,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Connected to Database"))

const coinlist = ["BTC", "YFI", "ATOM", "UNI", "LTC", "BNB", "LINK", "ETH", "XRP", "WAVES", "DOGE", "TRX", "TOMO", "YFII"];
const streamUrl = (reqType) => {
    let res = "";
    coinlist.forEach(coin => {
        res += coin.toLowerCase() + "usdt@" + reqType + "/";
    });
    return res.slice(0, -1);
}

const BinanceTickerStream = new Websocket("wss://stream.binance.com:9443/stream?streams=" + streamUrl("ticker"));
const BinanceOrderStream = new Websocket("wss://stream.binance.com:9443/stream?streams=" + streamUrl("depth5@1000ms"));
const BinanceTradeStream = new Websocket("wss://stream.binance.com:9443/stream?streams=" + streamUrl("aggTrade"));

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

io.on("connection", socket => {
    socket.emit("connectionStatus", "Connected");
});

BinanceTickerStream.on("message", data => {
    data = JSON.parse(data);

    const eventName = data.stream.match(/[a-z]*usdt/)[0].toUpperCase();
    io.emit(eventName, data);
});

BinanceOrderStream.on("message", data => {
    data = JSON.parse(data);
    const eventName = data.stream.match(/[a-z]*usdt/)[0].toUpperCase();
    io.emit(eventName + "@depth", data);
});


const TradeHistoryList = {};

BinanceTradeStream.on("message", data => {
    data = JSON.parse(data);
    const eventName = data.stream.match(/[a-z]*usdt/)[0].toUpperCase();
    if (TradeHistoryList.hasOwnProperty(eventName)) {
        if (TradeHistoryList[eventName].length > 5) {
            TradeHistoryList[eventName].pop();
        }
        TradeHistoryList[eventName].unshift(data.data);
    } else {
        TradeHistoryList[eventName] = [data.data];
    }
    io.emit(eventName + "@trade", TradeHistoryList[eventName]);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(auth);
app.use("/login", login);
app.use("/coinList", coinList);
app.use("/funds", funds);
app.use("/createAcc", createAcc);
app.use("/placeOrder", placeOrder);
app.use("/chngDetails", chngDetails);

server.listen(process.env.PORT || 5000, () => {
    console.log(`server listining on ${process.env.PORT || 5000} (websocket and express)`);
});