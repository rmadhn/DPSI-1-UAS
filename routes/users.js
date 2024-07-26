// routes/users.js
const express = require("express");
const router = express.Router();
const { User } = require("../models/index"); // Ensure correct import
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");

// Endpoint untuk mengunggah gambar profil
router.post(
  "/uploadProfilePic",
  authenticate,
  upload.single("profilePic"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "File size is too large. Max file size is 10MB" });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePic = req.file.path; // Save image path to database
      await user.save();
      res.json({
        message: "Profile picture uploaded successfully",
        filePath: req.file.path,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
