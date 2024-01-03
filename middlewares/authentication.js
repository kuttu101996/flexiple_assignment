const jwt = require("jsonwebtoken");
const prisma = require("../db/db.config");
require("dotenv").config();

const authentication = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send({ error: "Unauthorized - Token missing" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.secretKey);
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    if (!user) {
      return res.status(403).json({ error: "Forbidden - User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden - Invalid token" });
  }
};

module.exports = authentication;
