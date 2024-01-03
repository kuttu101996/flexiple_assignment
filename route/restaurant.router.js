const { addRestaurant } = require("../controller/restaurant.controller");

const restaurantRouter = require("express").Router();

restaurantRouter.post("/add", addRestaurant);

module.exports = restaurantRouter;
