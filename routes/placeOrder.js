const router = require("express").Router();

const { User } = require("../models/Users");
const io = require("socket.io-client");

router.post("/", async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).send("send all the required details.");
    const socket = io(`http://localhost:${process.env.PORT}`, { autoConnect: false });
    socket.open();
    let { amount, quantity, side, selected } = req.body;
    if(amount <= 0 || quantity <= 0){
      return res.status(400).send("quantity and amount should be more than 0");
    }
    const details = await User.findById(res.locals.details._id);
    if ((side === "Buy" && details.funds["USDT"] >= amount) || (side === "Sell" && details.funds[selected.slice(0, -4)] >= quantity)) {
        let latestPrice = 0;
        socket.on(selected, async ticker => {
            latestPrice = parseFloat(ticker.data.c);
            amount = parseFloat(amount);
            quantity = parseFloat(quantity);

            const latestQty = amount / latestPrice;
            if (side === "Buy") {
                details.funds[selected.slice(0, -4)] = latestQty;
                details.funds["USDT"] -= amount;
            } else {
                details.funds["USDT"] += quantity * latestPrice;
                details.funds[selected.slice(0, -4)] -= quantity;
            }
            await User.findByIdAndUpdate(res.locals.details._id, { funds: details.funds });
            socket.close();
            console.log("order executed");
            return res.send("Order executed Successfully");

        });

    } else {
        console.log("order NOT executed");

        return res.send("Funds are insuffient to perform the transaction.");
    }
});

module.exports = router;