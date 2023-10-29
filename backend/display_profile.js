///////////////////////////////// display_profile.js
const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");

// Define a route for displaying a user's profile
const route = (db) => {
  router.get("/:user_name", auth, (req, res) => {
    const user_name = req.params.user_name;
    const u_id = req.user.u_id;

    // Query the user data from the database
    const getUserQuery = `
    SELECT u.*, 
        CASE
            WHEN f.requester_id = ? AND f.accepter_id = u.u_id THEN 1  -- You are the requester
            WHEN f.requester_id = u.u_id AND f.accepter_id = ? THEN 1  -- You are the accepter
            ELSE 0
        END AS is_friend,
        GROUP_CONCAT(ui.interest) AS interests
    FROM user AS u
    LEFT JOIN friends_with AS f ON (f.requester_id = ? AND f.accepter_id = u.u_id) OR (f.requester_id = u.u_id AND f.accepter_id = ?)
    LEFT JOIN user_interests AS ui ON ui.user_id = u.u_id
    WHERE u.user_name = ?
    GROUP BY u.u_id;
    `;

    db.query(
      getUserQuery,
      [u_id, u_id, u_id, u_id, user_name],
      (error, results) => {
        if (error) {
          // Handle error
          console.error("Error retrieving user data:", error);
          res.status(500).json({ error: "Error retrieving user data" });
        } else {
          if (results.length === 0) {
            // User not found
            res.status(404).json({ error: "User not found" });
          } else {
            // User data found
            const user = results[0];
            const userData = {
              u_id: user.u_id,
              user_name: user.user_name,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              b_date: user.b_date,
              b_month: user.b_month,
              b_year: user.b_year,
              sex: user.sex,
              profile_picture: user.profile_picture,
              location: user.location,
              affiliation: user.affiliation,
              bio: user.bio,
              is_friend: user.is_friend,
              interests: user.interests
            };
            res.json(userData);
          }
        }
      }
    );
  });

  return router;
};
module.exports = route;
