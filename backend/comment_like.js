const express = require("express");
const router = express.Router();
const auth = require("./authMiddleware");

const route = (db) => {
  const commentExists = (req, res, next) => {
    const commentId = req.body.comment_id || req.query.comment_id;
    db.query(
      "SELECT * FROM comment WHERE c_id = ?",
      [commentId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Comment not found" });
        }
        next();
      }
    );
  };

  router.get("/", auth, commentExists, (req, res) => {
    const userId = req.user.u_id;
    const commentId = req.query.comment_id;

    db.query(
      "SELECT liketype_id FROM comment_like WHERE user_id = ? AND comment_id = ?",
      [userId, commentId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        if (!results[0]) return;
        res.status(200).json({ like: results[0].liketype_id });
      }
    );
  });

  router.post("/add", auth, commentExists, (req, res) => {
    const userId = req.user.u_id;
    const commentId = req.body.comment_id;
    const likeTypeId = req.body.liketype_id;

    const like = {
      l_time: new Date().toISOString().slice(11, 19),
      l_date: new Date().getDate(),
      l_month: new Date().getMonth() + 1,
      l_year: new Date().getFullYear(),
      liketype_id: likeTypeId,
      user_id: userId,
      comment_id: commentId,
    };

    db.query("INSERT INTO comment_like SET ?", like, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Like added to comment successfully" });
    });
  });

  router.delete("/delete", auth, commentExists, (req, res) => {
    const userId = req.user.u_id;
    const commentId = req.body.comment_id;

    db.query(
      "DELETE FROM comment_like WHERE user_id = ? AND comment_id = ?",
      [userId, commentId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res
          .status(200)
          .json({ message: "Like removed from comment successfully" });
      }
    );
  });

  return router;
};

module.exports = route;
