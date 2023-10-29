/////////////////// post_feed.js
const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");
const timePresent = require("./timePresent");

// API endpoint for retrieving the post feed and connection with db
const route = (db) => {
  router.get("/", auth, (req, res) => {
    const u_id = req.user.u_id; //user ID is passed as a query parameter

    const query = `
    SELECT 
        p.p_id
    FROM post AS p
    LEFT JOIN friends_with AS fw ON (fw.accepter_id = p.user_id OR fw.requester_id = p.user_id)
    WHERE (fw.accepter_id = ? OR fw.requester_id = ?) OR p.user_id = ? OR (p.private = 0)
    GROUP BY p.p_id
    ORDER BY p.p_year DESC, p.p_month DESC, p.p_date DESC, p.p_time DESC;
    `;

    db.query(query, [u_id, u_id, u_id], (err, results) => {
      if (err) {
        console.error("Error retrieving posts from the database:", err);
        res.status(500).json({ error: "Failed to retrieve posts" });
      }
      if (results.length == 1 && results[0].p_id == null) {
        return;
      } else {
        // Process and format the retrieved data as needed
        const posts = results.map((post) => ({
          id: post.p_id,
        }));

        res.json(posts);
      }
    });
  });

  router.get("/profile/:id", auth, (req, res) => {
    const u_id = req.params.id; //user ID is passed as a query parameter

    // Retrieve posts from friends only
    const query = `
    SELECT 
        p.p_id
    FROM post AS p
    LEFT JOIN friends_with AS fw ON (fw.accepter_id = p.user_id OR fw.requester_id = p.user_id)
    WHERE p.user_id = ? 
    GROUP BY p.p_id
    ORDER BY p.p_year DESC, p.p_month DESC, p.p_date DESC, p.p_time DESC;
    `;

    db.query(query, [u_id], (err, results) => {
      if (err) {
        console.error("Error retrieving posts from the database:", err);
        res.status(500).json({ error: "Failed to retrieve posts" });
      } else {
        if (results.length == 1 && results[0].p_id == null) {
          res.json([]);
          return;
        }

        // Process and format the retrieved data as needed
        const posts = results.map((post) => ({
          id: post.p_id,
        }));

        res.json(posts);
      }
    });
  });
  return router;
};

module.exports = route;
