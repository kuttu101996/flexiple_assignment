const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./route/user.router");
const restaurantRouter = require("./route/restaurant.router");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("All good");
});

app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter)

app.listen(process.env.port, () => {
  console.log(`Server at ${process.env.port}`);
});
