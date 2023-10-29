const express = require("express");
const multer = require("multer");
const slugify = require("slugify");
const router = express.Router();

const route = (server) => {
  // Set up storage for multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/media/");
    },
    filename: function (req, file, cb) {
      const originalName = file.originalname;
      const sanitizedName = slugify(originalName, { remove: /[*+~()'"!:@]/g });
      const uniqueFileName = `${Date.now()}-${sanitizedName}`;
      cb(null, uniqueFileName);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 104857600 },
  });

  // POST route to upload a new profile picture
  router.post("/upload", upload.single("media"), (req, res) => {
    if (req.file) {
      const mediaPath =
        server + req.file.path.replace(/\\/g, "/").replace("public/", "");
      res.status(200).json({ mediaURL: mediaPath });
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  });

  return router;
};

module.exports = route;
