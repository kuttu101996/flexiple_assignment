const prisma = require("../db/db.config");

const getMenu = async (req, res) => {
  try {
    const user = req.user;
    const getRestaurantId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { restaurant_id: true },
    });
    if (getRestaurantId.restaurant_id !== null) {
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { id: getRestaurantId.restaurant_id },
        //   include: {
        //     menu: {
        //       where: { is_active: true },
        //     },
        //   },
      });
      if (!existingRestaurant) {
        return res.status(404).send({ message: "Restaurant not found" });
      }
      const menuItems = await prisma.menuItem.findMany({
        where: {
          restaurant_id: existingRestaurant.id,
          is_active: true,
        },
      });
      return res
        .status(200)
        .send({ message: "All menu items", data: menuItems });
    } else {
      return res.status(400).send({
        message: "Admin and Super_admin not associated with any restaurant",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
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
      restaurant_id: parseInt(findRestaurant.id),
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
      restaurant_id: parseInt(findRestaurant.id),
    },
  });
  return res.status(200).send({ message: "Menu added", data: newMenuItem });
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuId = req.params.id;
    const { restaurant_id } = req.body;

    const findMenu = await prisma.menuItem.findUnique({
      where: {
        id: parseInt(menuId),
        restaurant_id: restaurant_id,
      },
    });
    if (!findMenu) {
      return res.status(404).send({ message: "Menu item not found" });
    }
    const deletedMenu = await prisma.menuItem.update({
      where: {
        id: parseInt(menuId),
      },
      data: {
        is_active: false,
      },
    });
    return res
      .status(200)
      .send({ message: "Menu item deleted", data: deletedMenu });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updateMenu = async (req, res) => {
  const menuId = req.params.id;
  const { name, price, description } = req.body;
  const nameExistanceCheck = await prisma.menuItem.findFirst({
    where: {
      name: name,
    },
  });
  if (nameExistanceCheck) {
    return res.status(400).send({ message: "Name already exist" });
  }
  const updatedMenuItem = await prisma.menuItem.update({
    where: { id: parseInt(menuId) },
    data: {
      ...(name && { name }),
      ...(price && { price }),
      ...(description && { description }),
    },
  });
  return res
    .status(200)
    .send({ message: "Successfully Updated", data: updatedMenuItem });
};

module.exports = { getMenu, addMenu, deleteMenuItem, updateMenu };
