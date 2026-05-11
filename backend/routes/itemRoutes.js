const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats,
} = require("../controllers/itemController");

// GET /api/items/stats  — must be before /:id
router.get("/stats", getStats);

// GET  /api/items        — list with filters & pagination
// POST /api/items        — report a lost or found item
router.route("/").get(getAllItems).post(createItem);

// GET    /api/items/:id  — get single item
// PUT    /api/items/:id  — update item
// DELETE /api/items/:id  — delete item
router.route("/:id").get(getItemById).put(updateItem).delete(deleteItem);

module.exports = router;
