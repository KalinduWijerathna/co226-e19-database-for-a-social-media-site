const express = require("express");
const multer = require("multer");
const slugify = require("slugify");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebaseApp = require("./firebase");
const storage = getStorage(firebaseApp);

const router = express.Router();

const route = () => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 104857600 },
  });

  router.post("/upload", upload.single("media"), async (req, res) => {
    if (req.file) {
      const mediaBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      const sanitizedName = slugify(originalName, { remove: /[*+~()'"!:@]/g });
      const uniqueFileName = `${Date.now()}-${sanitizedName}`;
      const mediaPath = `media/${uniqueFileName}`;

      try {
        const storageRef = ref(storage, mediaPath);
        await uploadBytes(storageRef, mediaBuffer);
        const mediaURL = await getDownloadURL(storageRef);

        res.status(200).json({ mediaURL });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error uploading media" });
      }
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  });

  return router;
};

module.exports = route;
