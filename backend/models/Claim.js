const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item reference is required"],
    },
    claimerName: {
      type: String,
      required: [true, "Claimer name is required"],
      trim: true,
    },
    claimerEmail: {
      type: String,
      required: [true, "Claimer email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    claimerPhone: {
      type: String,
      trim: true,
    },
    proofDescription: {
      type: String,
      required: [true, "Please describe proof of ownership"],
      trim: true,
      maxlength: [500, "Proof description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
      trim: true,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Claim", claimSchema);
