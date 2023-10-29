////////////////////////////////// friend_request.js

const express = require("express");
const router = express.Router();
const db = require("./index"); // Assuming the database connection is in index.js
const auth = require("./authMiddleware");
const timePresent = require("./timePresent");
const socketService = require("./socketService"); // define web socket

router.get("/", auth, (req, res) => {
  const requestee = req.user.u_id;

  db.query(
    `SELECT
        fr.requester_id,
        fr.req_time,
        fr.req_date,
        fr.req_month,
        fr.req_year,
        fr.req_status,
        u.user_name AS requester_username,
        u.first_name AS requester_first_name,
        u.last_name AS requester_last_name,
        u.profile_picture AS requester_profile_picture
    FROM friend_request AS fr
    INNER JOIN user AS u ON fr.requester_id = u.u_id
    WHERE fr.requestee_id = ? && fr.req_status = 'pending';`,
    [requestee],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.send(
        results.map((result) => ({
          requester_id: result.requester_id,
          date: timePresent(
            result.req_year,
            result.req_month,
            result.req_date,
            result.req_time.split(":")[0],
            result.req_time.split(":")[1]
          ),
          req_status: result.req_status,
          user_name: result.requester_username,
          first_name: result.requester_first_name,
          last_name: result.requester_last_name,
          profile_picture: result.requester_profile_picture,
        }))
      );
    }
  );
});

// POST route to send a friend request
router.post("/send", auth, (req, res) => {
  const requesterId = req.user.u_id;
  const requesteeId = req.body.friend_id;

  // Check if a friend request already exists
  db.query(
    "SELECT * FROM friend_request WHERE requester_id = ? AND requestee_id = ? AND req_status = 'pending'",
    [requesterId, requesteeId],
    (err, existingRequests) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (existingRequests.length > 0) {
        return res.status(400).json({ error: "Friend request already exists" });
      }

      // If no existing request, insert the friend request
      const currentTime = new Date();
      db.query(
        "INSERT INTO friend_request (requestee_id, requester_id, req_time, req_date, req_month, req_year, req_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          requesteeId,
          requesterId,
          currentTime.toISOString().slice(11, 19),
          currentTime.getDate(),
          currentTime.getMonth() + 1,
          currentTime.getFullYear(),
          "pending",
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
          }
          const friendReqSocket = socketService.getSocketNamespace("friendreq");
          if (friendReqSocket) {
            friendReqSocket.emit("sendRequest", requesteeId);
          }
          res.status(200).json({ message: "Friend request sent successfully" });
        }
      );
    }
  );
});

// PUT route to accept/reject a friend request
router.post("/accept", auth, (req, res) => {
  const requesteeId = req.user.u_id; // Assuming the requestee's ID is available from the authenticated user
  const requesterId = req.body.friend_id; // Assuming the requester's ID is provided in the request body

  // Update the friend request status in the database
  db.query(
    "UPDATE friend_request SET req_status = 'accepted' WHERE requestee_id = ? AND requester_id = ?",
    [requesteeId, requesterId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      // Insert a record into the friends_with table to establish the friendship
      const accDate = new Date().toISOString(); // Current date and time
      db.query(
        "INSERT INTO friends_with (friend_id, requester_id, accepter_id, acc_date) VALUES (?, ?, ?, ?)",
        [requesterId, requesterId, requesteeId, accDate],
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
          }

          const friendReqSocket = socketService.getSocketNamespace("friendreq");
          if (friendReqSocket) {
            friendReqSocket.emit("acceptRequest", requesterId);
          }

          res.status(200).json({
            message: "Friend request accepted and added to friends_with",
          });
        }
      );
    }
  );
});

// DELETE route to cancel a friend request
router.delete("/cancel", auth, (req, res) => {
  const requesterId = req.user.u_id; // Assuming the requester's ID is provided in the request body
  const requesteeId = req.body.friend_id; // Assuming the requestee's ID is provided in the request body
  // Delete the friend request from the database
  db.query(
    "DELETE FROM friend_request WHERE requester_id = ? AND requestee_id = ?",
    [requesterId, requesteeId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      const friendReqSocket = socketService.getSocketNamespace("friendreq");
      if (friendReqSocket) {
        friendReqSocket.emit("cancelRequest", requesteeId);
      }
      res.status(200).json({ message: "Friend request canceled successfully" });
    }
  );
});

// DELETE route to cancel a friend request
router.delete("/reject", auth, (req, res) => {
  const requesteeId = req.user.u_id; // Assuming the requester's ID is provided in the request body
  const requesterId = req.body.friend_id; // Assuming the requestee's ID is provided in the request body
  // Delete the friend request from the database
  db.query(
    "DELETE FROM friend_request WHERE requester_id = ? AND requestee_id = ?",
    [requesterId, requesteeId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }
      const friendReqSocket = socketService.getSocketNamespace("friendreq");
      if (friendReqSocket) {
        friendReqSocket.emit("rejectRequest", requesterId, requesteeId);
      }
      res.status(200).json({ message: "Friend request deleted successfully" });
    }
  );
});

router.delete("/unfriend", auth, (req, res) => {
  const userId = req.user.u_id; // Assuming the user's ID is available from the authenticated user
  const friendId = req.body.friend_id; // Assuming the friend's ID is provided in the request body

  // Delete the friendship record from the friends_with table
  db.query(
    "DELETE FROM friends_with WHERE (requester_id = ? AND accepter_id = ?) OR (requester_id = ? AND accepter_id = ?)",
    [userId, friendId, friendId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      const friendReqSocket = socketService.getSocketNamespace("friendreq");
      if (friendReqSocket) {
        friendReqSocket.emit("unfriend", friendId, userId);
      }
      res.status(200).json({ message: "Friendship deleted successfully" });
    }
  );
});

module.exports = router;
