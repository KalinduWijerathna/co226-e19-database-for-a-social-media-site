///////////////////////////////// post.js

const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");
const timePresent = require("./timePresent");

// Define a route for post handling with database connection
const route = (db) => {
  router.get("/get/:postid", auth, (req, res) => {
    const postId = req.params.postid; // Get the post ID from the route parameter
    const userId = req.user.u_id; // Assuming the user ID is provided in the request body

    db.query(
      `
      SELECT 
          p.*, 
          COALESCE(c.commentCount, 0) AS commentCount, 
          COALESCE(pl.likeCount, 0) AS likeCount,
          u.user_name,
          u.first_name,
          u.last_name,
          u.profile_picture,
          GROUP_CONCAT(lt.liketype_id ORDER BY lt.likeCount DESC) AS liketype_ids
      FROM post AS p
      LEFT JOIN user AS u ON u.u_id = p.user_id
      LEFT JOIN (
          SELECT post_id, COUNT(c_id) AS commentCount
          FROM comment
          GROUP BY post_id
      ) AS c ON c.post_id = p.p_id
      LEFT JOIN (
          SELECT post_id, COUNT(id) AS likeCount
          FROM post_like
          GROUP BY post_id
      ) AS pl ON pl.post_id = p.p_id
      LEFT JOIN (
          SELECT post_id, liketype_id, COUNT(id) AS likeCount
          FROM post_like
          GROUP BY post_id, liketype_id
      ) AS lt ON lt.post_id = p.p_id
      WHERE p.p_id = ?;  
    `,
      [postId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Post not found" });
        }
        const post = results.map((post) => ({
          id: post.p_id,
          date: timePresent(
            post.p_year,
            post.p_month,
            post.p_date,
            post.p_time.split(":")[0],
            post.p_time.split(":")[1]
          ),
          content: post.content,
          commentCount: post.commentCount,
          likeCount: post.likeCount,
          likeTypes: post.liketype_ids,
          media: post.media,
          m_type: post.m_type,
          uname: post.user_name,
          fname: post.first_name,
          lname: post.last_name,
          propic: post.profile_picture,
          // any other required properties
        }));

        res.send(post[0]);
      }
    );
  });

  // POST route to add a new post
  router.post("/add", auth, (req, res) => {
    const userId = req.user.u_id; // Assuming the user ID is provided in the request body
    const { content, media, m_type, private } = req.body;

    const post = {
      p_time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      p_date: new Date().getDate(),
      p_month: new Date().getMonth() + 1,
      p_year: new Date().getFullYear(),
      content,
      media,
      m_type,
      private, // Add the "private" field
      user_id: userId,
    };

    db.query("INSERT INTO post SET ?", post, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Post added successfully" });
    });
  });

  // DELETE route to delete a post
  router.delete("/delete", auth, (req, res) => {
    const postId = req.body.p_id; // Assuming the post ID is provided as a route parameter
    const userId = req.user.u_id; // Assuming the user ID is provided in the request body
    db.query(
      "SELECT user_id FROM post WHERE p_id = ?",
      [postId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Post not found" });
        }
        const postUserId = results[0].user_id;
        if (postUserId !== userId) {
          return res
            .status(403)
            .json({ error: "You are not authorized to delete this post" });
        }
        db.query(
          "DELETE FROM post WHERE p_id = ?",
          [postId],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ message: "Post deleted successfully" });
          }
        );
      }
    );
  });

  return router;
};

module.exports = route;
