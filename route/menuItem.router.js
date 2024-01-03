const {
  addMenu,
  getMenu,
  deleteMenuItem,
  updateMenu,
} = require("../controller/menuItem.controller");
const { menuItem } = require("../db/db.config");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const menuRouter = require("express").Router();

menuRouter.get("/", authentication, getMenu);
menuRouter.post("/addmenu", authentication, authorization, addMenu);
menuRouter.post("/:id", authentication, authorization, deleteMenuItem);
menuRouter.put("/:id", authentication, authorization, updateMenu);

module.exports = menuRouter;
