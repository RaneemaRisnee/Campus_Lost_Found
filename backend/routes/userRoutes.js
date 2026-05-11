const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// GET  /api/users  — all users
// POST /api/users  — register user
router.route("/").get(getAllUsers).post(createUser);

// GET    /api/users/:id
// PUT    /api/users/:id
// DELETE /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
