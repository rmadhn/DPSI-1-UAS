const express = require("express");
const router = express.Router();
const { archive } = require("../models"); // Assuming 'archive' model is defined in the models directory
const { authenticate } = require("../middleware/auth"); // Assuming you have an authenticate middleware

// Route to create a new archive
router.post("/", authenticate, async (req, res) => {
  try {
    const { arsipName, categoryID, description } = req.body;
    const newArchive = await archive.create({
      arsipName,
      categoryID,
      description,
    });
    res.status(201).json(newArchive);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      res
        .status(400)
        .json({
          message: "Foreign key constraint error: Category ID not found",
        });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

const { Op } = require("sequelize");

// Route to get all archives with pagination
router.get("/", authenticate, async (req, res) => {
  let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

  // Validate and parse limit to ensure it's a number
  limit = parseInt(limit, 10);

  try {
    const offset = (page - 1) * limit;

    const { count, rows: archives } = await archive.findAndCountAll({
      offset,
      limit,
    });

    if (archives.length === 0) {
      return res.status(404).json({ message: "Archives not found" });
    }

    const totalPages = Math.ceil(count / limit);

    const response = {
      totalCount: count,
      totalPages,
      currentPage: page,
      archives,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching archives:", error);
    res.status(500).json({ message: "Failed to fetch archives" });
  }
});

// Route to get an archive by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const archiveItem = await archive.findByPk(id);
    if (!archiveItem) throw new Error("Archive not found");
    res.json(archiveItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update an archive by ID
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { arsipName, categoryID, description } = req.body;
    const archiveItem = await archive.findByPk(id);
    if (!archiveItem) throw new Error("Archive not found");
    archiveItem.arsipName = arsipName;
    archiveItem.categoryID = categoryID;
    archiveItem.description = description;
    await archiveItem.save();
    res.json(archiveItem);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      res
        .status(400)
        .json({
          message: "Foreign key constraint error: Category ID not found",
        });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Route to delete an archive by ID
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const archiveItem = await archive.findByPk(id);
    if (!archiveItem) throw new Error("Archive not found");
    await archiveItem.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
