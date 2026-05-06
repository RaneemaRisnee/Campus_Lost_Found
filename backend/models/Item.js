const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Clothing",
        "Accessories",
        "Books & Stationery",
        "ID & Cards",
        "Keys",
        "Bags",
        "Sports Equipment",
        "Other",
      ],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["lost", "found"],
    },
    status: {
      type: String,
      enum: ["active", "claimed", "resolved", "expired"],
      default: "active",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    dateOccurred: {
      type: Date,
      required: [true, "Date is required"],
    },
    contactName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
itemSchema.index({ title: "text", description: "text", tags: "text" });
itemSchema.index({ type: 1, status: 1, category: 1 });

module.exports = mongoose.model("Item", itemSchema);
