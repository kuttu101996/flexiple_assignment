const {
  addMenu,
  getMenu,
  deleteMenuItem,
} = require("../controller/menuItem.controller");
const { menuItem } = require("../db/db.config");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const menuRouter = require("express").Router();

menuRouter.get("/", authentication, getMenu);
menuRouter.post("/addmenu", addMenu);
menuRouter.post("/:id", deleteMenuItem);

module.exports = menuRouter;
