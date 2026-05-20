const Item = require("../models/Item");

// @desc    Get all items (with filtering, search, pagination)
// @route   GET /api/items
// @access  Public
const getAllItems = async (req, res) => {
  try {
    const {
      type,
      category,
      status,
      search,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build filter object
    const filter = {};
    if (type && ["lost", "found"].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = "active"; // Default: only show active items

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).select("-__v");
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Increment view count
    await Item.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid item ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new item report
// @route   POST /api/items
// @access  Public
const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({
      success: true,
      message: `Item reported as ${item.type} successfully`,
      data: item,
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

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Public (in real app: protected)
const updateItem = async (req, res) => {
  try {
    // Prevent changing immutable fields
    delete req.body._id;
    delete req.body.viewCount;

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid item ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Public (in real app: protected)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully", data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid item ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/items/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const [totalLost, totalFound, totalResolved, byCategory] =
      await Promise.all([
        Item.countDocuments({ type: "lost", status: "active" }),
        Item.countDocuments({ type: "found", status: "active" }),
        Item.countDocuments({ status: "resolved" }),
        Item.aggregate([
          { $match: { status: "active" } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalLost,
        totalFound,
        totalResolved,
        byCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats,
};
