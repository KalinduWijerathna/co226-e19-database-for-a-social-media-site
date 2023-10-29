const jwt = require("jsonwebtoken");
const secret = require("./JWTconfig");
const db = require("./index");

// Middleware to check if the token is valid
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret.secreteKey); // Replace with your secret key

    const userId = decoded.u_id;

    db.query("SELECT * FROM user WHERE u_id = ?", [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
    });

    // Attach the decoded payload to the request object for later use
    req.user = decoded;

    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
