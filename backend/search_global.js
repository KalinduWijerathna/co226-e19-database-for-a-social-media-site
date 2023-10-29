///////////////////////////////////////////// search_global.js
const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");

// API endpoint for searching and retrieving friend profiles a with db connection
const route = (db) => {
  router.get("/", auth, (req, res) => {
    const searchQuery = req.query.q; // search query is passed as a query parameter
    const u_id = req.user.u_id;

    // Retrieve friend profiles from the 'user' table based on the search query
    const query = `
    SELECT
        u.u_id,
        u.user_name,
        u.first_name,
        u.last_name,
        u.profile_picture,
        CASE
            WHEN f.requester_id = ? AND f.accepter_id = u.u_id THEN 1  -- You are the requester
            WHEN f.requester_id = u.u_id AND f.accepter_id = ? THEN 1  -- You are the accepter
            ELSE 0
        END AS is_friend,
        CASE
            WHEN fr.requestee_id = u.u_id AND fr.requester_id = ? AND fr.req_status = 'pending' THEN 1  -- You sent a friend request
            ELSE 0
        END AS sent_request
    FROM user AS u
    LEFT JOIN friends_with AS f ON (f.requester_id = ? AND f.accepter_id = u.u_id) OR (f.requester_id = u.u_id AND f.accepter_id = ?)
    LEFT JOIN friend_request AS fr ON fr.requestee_id = u.u_id AND fr.requester_id = ?
    WHERE u.u_id != ? AND (LOWER(u.user_name) LIKE LOWER(?) OR LOWER(u.first_name) LIKE LOWER(?) OR LOWER(u.last_name) LIKE LOWER(?))
    LIMIT 20;
    `;
    const searchValue = `%${searchQuery}%`;
    db.query(
      query,
      [
        u_id,
        u_id,
        u_id,
        u_id,
        u_id,
        u_id,
        u_id,
        u_id,
        searchValue,
        searchValue,
        searchValue,
      ],
      (err, results) => {
        if (err) {
          console.error(
            "Error retrieving user profiles from the database:",
            err
          );
          res.status(500).json({ error: "Failed to retrieve user profiles" });
        } else {
          const profiles = results;

          res.json(profiles);
        }
      }
    );
  });
  return router;
};
module.exports = route;
