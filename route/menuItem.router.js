const {
  addMenu,
  getMenu,
  deleteMenuItem,
  updateMenu,
} = require("../controller/menuItem.controller");
const authentication = require("../middlewares/authentication");
const managerAuthorizationMiddleware = require("../middlewares/managerAuthorizationMiddleware");

const menuRouter = require("express").Router();

menuRouter.get("/", authentication, getMenu);

menuRouter.post(
  "/addmenu",
  authentication,
  managerAuthorizationMiddleware,
  addMenu
);
menuRouter.post(
  "/delete/:id",
  authentication,
  managerAuthorizationMiddleware,
  deleteMenuItem
);
menuRouter.patch(
  "/update/:id",
  authentication,
  managerAuthorizationMiddleware,
  updateMenu
);

module.exports = menuRouter;
