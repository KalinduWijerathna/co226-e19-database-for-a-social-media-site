///////////////////////////////////////////// search_friend.js
const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");

// API endpoint for searching and retrieving friend profiles a with db connection
const route = (db) => {
  router.get("/", (req, res) => {
    const searchQuery = req.query.q; // search query is passed as a query parameter
    const u_id = req.query.u_id; // user ID is passed as a query parameter

    // Retrieve friend profiles from the 'user' table based on the search query
    const query = `
    SELECT u.user_name,u.first_name, u.last_name, u.profile_picture
    FROM user AS u
    JOIN friends_with AS f ON ( u.u_id = f.accepter_id OR u.u_id = f.requester_id )
    WHERE (f.requester_id = ? OR f.accepter_id = ? ) 
  `;
    const searchValue = `%${searchQuery}%`;
    db.query(query, [u_id, searchValue, searchValue], (err, results) => {
      if (err) {
        console.error(
          "Error retrieving friend profiles from the database:",
          err
        );
        res.status(500).json({ error: "Failed to retrieve friend profiles" });
      } else {
        const profiles = results;

        res.json(profiles);
      }
    });
  });
  router.get("/all", auth, (req, res) => {
    const u_id = req.user.u_id; // user ID is passed as a query parameter

    // Retrieve friend profiles from the 'user' table based on the search query
    const query = `
    SELECT
        u.user_name,
        u.first_name,
        u.last_name,
        u.profile_picture
    FROM user AS u
    JOIN friends_with AS f ON (u.u_id = f.accepter_id OR u.u_id = f.requester_id)
    WHERE (f.requester_id = ? OR f.accepter_id = ?)
    AND u.u_id != ?
  `;
    db.query(query, [u_id, u_id, u_id], (err, results) => {
      if (err) {
        console.error(
          "Error retrieving friend profiles from the database:",
          err
        );
        res.status(500).json({ error: "Failed to retrieve friend profiles" });
      } else {
        const profiles = results;

        res.json(profiles);
      }
    });
  });
  return router;
};
module.exports = route;
