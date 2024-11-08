// In authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secret_key123456789@@";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Token d'accès non fourni" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
