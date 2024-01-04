const {
  registerUser,
  loginUser,
  deleteUser,
  changeUserRole,
} = require("../controller/user.controller");
const adminAuthorizationMiddleware = require("../middlewares/adminAuthorizationMiddleware");
const authentication = require("../middlewares/authentication");

const userRouter = require("express").Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.patch(
  "/changerole/:id",
  authentication,
  adminAuthorizationMiddleware,
  changeUserRole
);

userRouter.delete("/deleteuser", authentication, deleteUser);

module.exports = userRouter;
