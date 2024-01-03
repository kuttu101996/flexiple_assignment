const adminAuthorizationMiddleware = async (req, res, next) => {
  const user = req.user;
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") next();
  else return res.status(401).send({ message: "You are not authorized!" });
};

module.exports = adminAuthorizationMiddleware;
