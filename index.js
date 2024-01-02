const express = require("express");
require("dotenv").config();
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("All good");
});

app.listen(process.env.port, () => {
  console.log(`Server at ${process.env.port}`);
});
