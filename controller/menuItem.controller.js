const prisma = require("../db/db.config");

const getMenu = async (req, res) => {
  const user = req.user;
  const getRestaurantId = await prisma.user.findUnique({
    where: { id: user.id },
    select: { restaurant_id: true },
  });
  const restaurantMenu = await prisma.restaurant.findUnique({
    where: { id: getRestaurantId },
    include: {
      menu: {
        where: { is_active: true },
      },
    },
  });

  return res
    .status(200)
    .send({ message: "All menu items", data: restaurantMenu });
};

const addMenu = async (req, res) => {
  const { name, price, restaurant, description } = req.body;
  if (!name || !price || !restaurant) {
    return res.status(400).send({ message: "Details not provided" });
  }
  const findRestaurant = await prisma.restaurant.findUnique({
    where: { name: restaurant },
  });
  if (!findRestaurant) {
    return res
      .status(400)
      .send({ message: "No restaurant found with this name." });
  }
  const findMenu = await prisma.menuItem.findUnique({
    where: {
      name: name,
      restaurant_id: findRestaurant.id,
    },
  });
  if (findMenu) {
    return res
      .status(400)
      .send({ message: "A Menu Item already exist with this name" });
  }
  const newMenuItem = await prisma.menuItem.create({
    data: {
      name: name,
      price: price,
      restaurant_id: findRestaurant.id,
    },
  });
  return res.status(200).send({ message: "Menu added", data: newMenuItem });
};

const deleteMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { restaurant_id } = req.body;

    const existingMenu = await prisma.menuItem.findUnique({
      where: {
        id: id,
        restaurant_id: restaurant_id,
      },
    });
    if (!existingMenu) {
      return res.status(404).send({ message: "Menu item not found" });
    }
    const updatedMenu = await prisma.menuItem.update({
      where: {
        id: id,
      },
      data: {
        is_active: false,
      },
    });
    return res
      .status(200)
      .send({ message: "Menu item updated", data: updatedMenu });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { getMenu, addMenu, deleteMenuItem };
