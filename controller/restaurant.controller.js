const prisma = require("../db/db.config");

const addRestaurant = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ message: "Required details not provided" });
  }
  const findRestaurant = await prisma.restaurant.findUnique({
    where: {
      name,
    },
  });
  if (findRestaurant) {
    return res
      .status(400)
      .send({ message: "Restaurant name is already present" });
  }
  const newRestaurant = await prisma.restaurant.create({
    data: {
      name,
    },
  });
  return res
    .status(200)
    .send({ message: "Restaurant added", data: newRestaurant });
};

module.exports = { addRestaurant };
