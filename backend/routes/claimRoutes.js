const express = require("express");
const router = express.Router();
const {
  getAllClaims,
  getClaimById,
  createClaim,
  updateClaimStatus,
  deleteClaim,
} = require("../controllers/claimController");

// GET  /api/claims  — all claims
// POST /api/claims  — submit a claim
router.route("/").get(getAllClaims).post(createClaim);

// GET    /api/claims/:id  — single claim
// PATCH  /api/claims/:id  — update claim status
// DELETE /api/claims/:id  — delete claim
router
  .route("/:id")
  .get(getClaimById)
  .patch(updateClaimStatus)
  .delete(deleteClaim);

module.exports = router;
