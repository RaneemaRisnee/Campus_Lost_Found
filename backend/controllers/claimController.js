const Claim = require("../models/Claim");
const Item = require("../models/Item");

// @desc    Get all claims
// @route   GET /api/claims
// @access  Public (admin only in production)
const getAllClaims = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const claims = await Claim.find(filter)
      .populate("item", "title type category location status")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Claim.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: claims.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: claims,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single claim
// @route   GET /api/claims/:id
// @access  Public
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("item", "title type category location status contactEmail")
      .select("-__v");

    if (!claim) {
      return res
        .status(404)
        .json({ success: false, message: "Claim not found" });
    }
    res.status(200).json({ success: true, data: claim });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid claim ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a claim on an item
// @route   POST /api/claims
// @access  Public
const createClaim = async (req, res) => {
  try {
    const { item: itemId } = req.body;

    // Check item exists and is claimable
    const item = await Item.findById(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (item.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `This item is already ${item.status} and cannot be claimed`,
      });
    }

    // Check for duplicate claim from same email
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimerEmail: req.body.claimerEmail?.toLowerCase(),
      status: "pending",
    });
    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a pending claim for this item",
      });
    }

    const claim = await Claim.create(req.body);
    res.status(201).json({
      success: true,
      message: "Claim submitted successfully. The reporter will contact you.",
      data: claim,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update claim status (approve/reject)
// @route   PATCH /api/claims/:id
// @access  Public (admin only in production)
const updateClaimStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved, rejected, or pending",
      });
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNote: adminNote || null,
        resolvedAt: ["approved", "rejected"].includes(status)
          ? new Date()
          : null,
      },
      { new: true, runValidators: true }
    ).populate("item", "title");

    if (!claim) {
      return res
        .status(404)
        .json({ success: false, message: "Claim not found" });
    }

    // If approved, mark the item as claimed/resolved
    if (status === "approved") {
      await Item.findByIdAndUpdate(claim.item._id, { status: "resolved" });
    }

    res.status(200).json({
      success: true,
      message: `Claim ${status} successfully`,
      data: claim,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid claim ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a claim
// @route   DELETE /api/claims/:id
// @access  Public (admin only in production)
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);
    if (!claim) {
      return res
        .status(404)
        .json({ success: false, message: "Claim not found" });
    }
    res.status(200).json({
      success: true,
      message: "Claim deleted successfully",
      data: {},
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid claim ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllClaims,
  getClaimById,
  createClaim,
  updateClaimStatus,
  deleteClaim,
};
