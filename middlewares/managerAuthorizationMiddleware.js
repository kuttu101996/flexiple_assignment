const managerAuthorizationMiddleware = async (req, res, next) => {
  const user = req.user;
  if (user.role === "MANAGER") next();
  else return res.status(401).send({ message: "You are not authorized!" });
};

module.exports = managerAuthorizationMiddleware;
