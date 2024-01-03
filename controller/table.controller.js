const prisma = require("../db/db.config");

const reserveTableForCustomer = async (req, res) => {
  try {
    const { restaurant } = req.body;
    const restaurantTableAvailability = await prisma.restaurant.findUnique({
      where: {
        name: restaurant,
      },
      select: { id: true, available_tables: true },
    });
    if (!restaurantTableAvailability) {
      return res
        .status(400)
        .send({ message: "No restaurant found with the given name" });
    }
    if (restaurantTableAvailability.available_tables > 0) {
      const availableTables = await prisma.table.findMany({
        where: {
          restaurant_id: restaurantTableAvailability.id,
          is_available: true,
        },
      });
      const updateAvailability = await prisma.table.update({
        where: {
          id: availableTables[0].id,
        },
        data: {
          is_available: false,
        },
      });
      let updatedRes = await prisma.restaurant.update({
        where: {
          id: restaurantTableAvailability.id,
        },
        data: {
          available_tables: restaurantTableAvailability.available_tables - 1,
        },
      });
      return res.send({ restaurant: updatedRes, avail: updateAvailability });
    } else {
      return res.status(404).send({
        message: "No table available for this restaurant right now",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const orderAddToTable = async (req, res) => {
  try {
    const { table_id, menuItems } = req.body;
    if (!table_id || !menuItems) {
      return res.status(400).send({ message: "Required details not given" });
    }
    const findTable = await prisma.table.findUnique({
      where: {
        id: table_id,
        is_available: false,
      },
    });
    if (!findTable) {
      return res.status(400).send({ message: "No table found" });
    }
    let total_amount = 0;
    let items = [];
    menuItems.map(async (item) => {
      const itemCheck = await prisma.menuItem.findUnique({
        where: {
          name: item,
        },
      });
      if (itemCheck) {
        total_amount += itemCheck.price;
        items.push(itemCheck);
      }
    });
    const newOrder = await prisma.order.create({
      data: {
        table_id: table_id,
        total_amount: total_amount,
        items: items,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const madePayment = async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(400).send({ message: "No order found" });
    }
    const findOrder = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
    });
    const findTable = await prisma.table.update({
      where: {
        id: findOrder.table_id,
      },
      data: {
        is_available: true,
      },
    });
    const findRestaurant = await prisma.restaurant.update({
      where: {
        id: findTable.restaurant_id,
      },
    });
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: findTable.restaurant_id },
      data: {
        available_tables: findRestaurant.available_tables + 1,
      },
    });
    const newPayment = await prisma.payment.create({
      data: {
        order_id: order_id,
        amount: findOrder.total_amount,
      },
    });
    return res
      .status(200)
      .send({ message: "Payment made successfully", data: newPayment });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { reserveTableForCustomer, madePayment, orderAddToTable };
