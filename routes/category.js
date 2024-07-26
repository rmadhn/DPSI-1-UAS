// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const { Category } = require("../models");
const { authenticate } = require("../middleware/auth");
const { Op } = require("sequelize");

// Route to create a new category
router.post("/", authenticate, async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const category = await Category.create({ categoryName, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  // Validate and parse limit to ensure it's a number
  limit = parseInt(limit, 10);

  try {
    const offset = (page - 1) * limit;

    const categories = await Category.findAndCountAll({
      offset,
      limit,
    });

    if (categories.rows.length === 0) {
      res.status(404).json({ message: "Categories not found" });
    } else {
      const totalCount = categories.count;
      const totalPages = Math.ceil(totalCount / limit);

      const response = {
        totalCount,
        totalPages,
        currentPage: page,
        categories: categories.rows,
      };

      res.json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a category by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) throw new Error("Category not found");
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a category by ID
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description } = req.body;
    const category = await Category.findByPk(id);
    if (!category) throw new Error("Category not found");
    category.categoryName = categoryName;
    category.description = description;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a category by ID
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) throw new Error("Category not found");
    await category.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
