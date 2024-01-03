const { addRestaurant } = require("../controller/restaurant.controller");
const adminAuthorizationMiddleware = require("../middlewares/adminAuthorizationMiddleware");

const restaurantRouter = require("express").Router();

restaurantRouter.post("/add", addRestaurant);

module.exports = restaurantRouter;
