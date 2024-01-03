const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./route/user.router");
const restaurantRouter = require("./route/restaurant.router");
const menuRouter = require("./route/menuItem.router");
const tableRouter = require("./route/table.route");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello from Server, All good!");
});

app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/menu", menuRouter);
app.use("/api/table", tableRouter);

app.listen(process.env.port, () => {
  console.log(`Server at ${process.env.port}`);
});
