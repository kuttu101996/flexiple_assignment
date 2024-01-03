const {
  reserveTableForCustomer,
  orderAddToTable,
  madePayment,
} = require("../controller/table.controller");
const prisma = require("../db/db.config");
const authentication = require("../middlewares/authentication");

const tableRouter = require("express").Router();

tableRouter.post("/", authentication, reserveTableForCustomer);
tableRouter.post("/neworder", orderAddToTable);
tableRouter.post("/payment", madePayment);

module.exports = tableRouter;
