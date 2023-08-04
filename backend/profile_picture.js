///////////////////////////////// profile_picture.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Define a route for profile picture handling with database connection
const route = (db) => {

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profilepics/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to check if the user exists
const userExists = (req, res, next) => {
  const userId = req.body.u_id; // Assuming the user ID is provided in the request body
  db.query("SELECT u_id FROM user WHERE u_id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    next();
  });
  
};

// POST route to upload a new profile picture
router.post("/upload", userExists, upload.single("profile_picture"), (req, res) => {
  const userId = req.body.u_id; // Assuming the user ID is provided in the request body
  const imagePath = req.file.path;
  db.query("UPDATE user SET profile_picture = ? WHERE u_id = ?", [imagePath, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Profile picture uploaded successfully" });
  });
});

// PUT route to update an old profile picture
router.put("/update", userExists, upload.single("profile_picture"), (req, res) => {
  const userId = req.body.u_id; // Assuming the user ID is provided in the request body
  const imagePath = req.file.path;
  db.query("UPDATE user SET profile_picture = ? WHERE u_id = ?", [imagePath, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Profile picture updated successfully" });
  });
});

// DELETE route to delete a profile picture
router.delete("/delete", userExists, (req, res) => {
  const userId = req.body.u_id; // Assuming the user ID is provided in the request body
  db.query("SELECT profile_picture FROM user WHERE u_id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    const imagePath = results[0].profile_picture;
    fs.unlink(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete profile picture" });
      }
      db.query("UPDATE user SET profile_picture = NULL WHERE u_id = ?", [userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json({ message: "Profile picture deleted successfully" });
      });
    });
  });
});
return router;
};
module.exports = route;