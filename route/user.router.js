const {
  registerUser,
  loginUser,
  deleteUser,
} = require("../controller/user.controller");
const authentication = require("../middlewares/authentication");

const userRouter = require("express").Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/deleteuser", authentication, deleteUser);

module.exports = userRouter;
