const express = require("express");
const multer = require("multer");
const router = express.Router();
const auth = require("./authMiddleware");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} = require("firebase/storage");
const firebaseApp = require("./firebase"); // Import Firebase app instance

// Initialize Firebase Storage
const storage = getStorage(firebaseApp);

const upload = multer({ storage: multer.memoryStorage() });

// Define a route for profile picture handling
const route = () => {
  // POST route to upload a new profile picture
  router.post("/upload", upload.single("profile_picture"), async (req, res) => {
    if (req.file) {
      const imageBuffer = req.file.buffer; // Get the image buffer from multer
      const userId = req.body.u_id; // Assuming the user ID is provided in the request body
      const storagePath = `profile_pictures/${userId}/${req.file.originalname}`; // Path in Firebase Storage

      // Upload the image to Firebase Storage
      const storageRef = ref(storage, storagePath);
      try {
        await uploadBytes(storageRef, imageBuffer);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        res.status(200).json({
          message: "Profile picture uploaded successfully",
          downloadURL,
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Error uploading image to Firebase Storage" });
      }
    } else {
      res.status(400).json({ error: "No profile picture provided" });
    }
  });

  // PUT route to update a profile picture
  router.put(
    "/update",
    auth,
    upload.single("profile_picture"),
    async (req, res) => {
      if (req.file) {
        const imageBuffer = req.file.buffer; // Get the image buffer from multer
        const userId = req.user.u_id; // Assuming the user ID is available through the auth middleware
        const storagePath = `profile_pictures/${userId}/${req.file.originalname}`; // Path in Firebase Storage

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, storagePath);
        try {
          await uploadBytes(storageRef, imageBuffer);

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(storageRef);

          res.status(200).json({
            message: "Profile picture updated successfully",
            downloadURL,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error updating profile picture" });
        }
      } else {
        res.status(400).json({ error: "No profile picture provided" });
      }
    }
  );

  // DELETE route to delete a profile picture
  router.delete("/delete", auth, async (req, res) => {
    const userId = req.user.u_id; // Assuming the user ID is available through the auth middleware

    try {
      const storagePath = `profile_pictures/${userId}`; // Path in Firebase Storage

      const folderRef = ref(storage, storagePath);

      // List all items within the folder
      const items = await listAll(folderRef);

      // Delete each item within the folder
      const deletePromises = items.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);

      res.status(200).json({ message: "Profile picture deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting profile picture" });
    }
  });

  return router;
};

module.exports = route;
