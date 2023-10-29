const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");
const timePresent = require("./timePresent");

// Define a route for like and comment handling related to posts with database connection
const route = (db) => {
  // Middleware to check if the post exists
  const postExists = (req, res, next) => {
    const postId = req.body.p_id || req.query.p_id;
    db.query(
      "SELECT p_id FROM post WHERE p_id = ?",
      [postId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          console.log(err);
          return res.status(404).json({ error: "Post not found" });
        }
        next();
      }
    );
  };

  router.get("/get/:postid", (req, res) => {
    const postId = req.params.postid; // Get the post ID from the route parameter
    console.log(postId);

    db.query(
      `
      SELECT
        c.*,
        u.user_name,
        u.first_name,
        u.last_name,
        u.profile_picture,
        IFNULL(cl.likeCount, 0) AS likeCount,
        IFNULL(lt.liketype_ids, '') AS liketype_ids
      FROM comment AS c
      LEFT JOIN user AS u ON u.u_id = c.user_id
      LEFT JOIN (
        SELECT comment_id, COUNT(liketype_id) AS likeCount
        FROM comment_like
        GROUP BY comment_id
      ) AS cl ON cl.comment_id = c.c_id
      LEFT JOIN (
        SELECT comment_id, GROUP_CONCAT(liketype_id ORDER BY likeCount DESC) AS liketype_ids
        FROM (
          SELECT comment_id, liketype_id, COUNT(liketype_id) AS likeCount
          FROM comment_like
          GROUP BY comment_id, liketype_id
        ) AS temp
        GROUP BY comment_id
      ) AS lt ON lt.comment_id = c.c_id
      WHERE c.post_id = ?;
    `,
      [postId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          console.log(err);
          return res.status(404).json({ error: "Comment not found" });
        }

        const comment = results.map((com) => ({
          id: com.c_id,
          date: timePresent(
            com.c_year,
            com.c_month,
            com.c_date,
            com.c_time.split(":")[0],
            com.c_time.split(":")[1]
          ),
          content: com.content,
          uname: com.user_name,
          fname: com.first_name,
          lname: com.last_name,
          propic: com.profile_picture,
          likeCount: com.likeCount,
          liketypes: com.liketype_ids.split(",").slice(0, 3), // Take the first 3 liketype_ids
          // any other required properties
        }));

        // Return the comment details
        res.status(200).json(comment);
      }
    );
  });

  // POST route to add a comment to a post
  router.post("/add", auth, postExists, (req, res) => {
    const userId = req.user.u_id;
    const postId = req.body.p_id;
    const content = req.body.content;
    const comment = {
      c_time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      c_date: new Date().getDate(),
      c_month: new Date().getMonth() + 1,
      c_year: new Date().getFullYear(),
      content: content,
      user_id: userId,
      post_id: postId,
    };

    db.query("INSERT INTO comment SET ?", comment, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Comment added to post successfully" });
    });
  });

  // DELETE route to remove a comment from a post
  router.delete("/delete/:commentid", auth, postExists, (req, res) => {
    const commentId = req.params.commentid; // Get the comment ID from the route parameter

    db.query(
      "DELETE FROM comment WHERE c_id = ?",
      [commentId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }
        res
          .status(200)
          .json({ message: "Comment removed from post successfully" });
      }
    );
  });

  return router;
};

module.exports = route;
