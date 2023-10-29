////////////////////////// login.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Define a route for user login with Database connection
const route = (db, secretKey) => {
  router.post("/", (req, res) => {
    const { user_name, password } = req.body;

    // SQL query to fetch user from the database
    const query = `SELECT * FROM user WHERE user_name = ?`;

    // Execute the query
    db.query(query, [user_name], (error, results) => {
      if (error) {
        // Handle error
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error fetching user" });
      } else {
        if (results.length === 0) {
          // User not found
          res.status(404).json({ error: "User not found" });
        } else {
          const user = results[0];

          // Compare hashed passwords
          bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              res.status(500).json({ error: "Error comparing passwords" });
            } else {
              if (passwordMatch) {
                // Passwords match, create JWT token
                const payload = {
                  u_id: user.u_id,
                  user_name: user.user_name,
                };
                const options = { expiresIn: "1h" };
                const token = jwt.sign(payload, secretKey, options);
                res.json({ token, user });
              } else {
                // Incorrect password
                res.status(401).json({ error: "Incorrect password" });
              }
            }
          });
        }
      }
    });
  });

  return router;
};

module.exports = route;
