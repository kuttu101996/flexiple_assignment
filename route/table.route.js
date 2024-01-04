const {
  reserveTableForCustomer,
  orderAddToTable,
  madePayment,
} = require("../controller/table.controller");
const prisma = require("../db/db.config");
const authentication = require("../middlewares/authentication");

const tableRouter = require("express").Router();

tableRouter.post("/book", authentication, reserveTableForCustomer);
tableRouter.post("/neworder", authentication, orderAddToTable);
tableRouter.get("/payment/:id", authentication, madePayment);

module.exports = tableRouter;
