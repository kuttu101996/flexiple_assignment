const prisma = require("../db/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { name, email, password, restaurant, role } = req.body;
  if (!email || !password) {
    return res.status(400).send("Required details not provided");
  }
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (findUser) {
    return res
      .status(400)
      .send({ message: "Email already registered, try with another email." });
  }
  if (restaurant) {
    const findRestaurant = await prisma.restaurant.findUnique({
      where: {
        name: restaurant,
      },
    });
    if (!findRestaurant) {
      return res.status(400).send({
        message: "Restaurant not associated",
      });
    }
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        return res.status(500).send({ message: "Unable to hash password" });
      }
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hash,
          restaurant_id: findRestaurant.id,
        },
      });
      return res.status(200).send({ message: "User created", data: newUser });
    });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        return res.status(500).send({ message: "Unable to hash password" });
      }
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hash,
          role,
        },
      });
      return res.status(200).send({ message: "User created", data: newUser });
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Required details not provided");
  }
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!findUser) {
    return res.status(400).send({
      message: "No user register with this email, try register yourself.",
    });
  }
  bcrypt.compare(password, findUser.password, async function (err, result) {
    if (result) {
      const token = jwt.sign({ userId: findUser.id }, process.env.secretKey);
      return res
        .status(200)
        .send({ message: "Login Success", data: findUser, token });
    }
  });
};

const changeUserRole = async (req, res) => {
  const loggedUser = req.user;
  const id = req.params.id;
  if (loggedUser.role === "ADMIN" || loggedUser.role === "SUPER_ADMIN") {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!findUser) {
        return res
          .status(400)
          .send({ message: "No user found with the given id" });
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          role: "MANAGER",
        },
      });
      res
        .status(200)
        .send({ message: "User role updated successfully", data: updatedUser });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  } else {
    res.status(403).send({ message: "Not authorized to update user role" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.user.id;
  const findUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      is_active: false,
    },
  });
  return res.status(200).send({ message: "User account successfully deleted" });
};

module.exports = { registerUser, loginUser, deleteUser, changeUserRole };
