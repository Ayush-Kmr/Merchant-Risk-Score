const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    console.log("Token:", token); // Log the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log the decoded token

    req.merchantId = decoded.id;
    console.log("Merchant ID from token:", req.merchantId); // Log the merchant ID
    next();
  } catch (error) {
    console.error("JWT Error:", error); // Log any errors
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
