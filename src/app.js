const express = require("express");
const pokemonRouter = require("./routes/pokemon");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
    return res.status(200).json({ message: "Landing page." });
})

app.use("/", pokemonRouter);

module.exports = app;