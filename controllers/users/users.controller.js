const User = require("../../models/user.model");
const ErrorResponse = require("../../utils/error-response");
const asyncHandler = require("../../middlewares/async");
const { ERROR_MESSAGES } = require("../../utils/error-messages");

// @desc     Get all users
// @route    POST /api/v1/users
// @access   Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const total = await User.countDocuments();

  const users = await User.find()
    .skip(page * limit - limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    totalPage: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: users,
  });
});

// @desc     Get user by id
// @route    POST /api/v1/users
// @access   Private
exports.getUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  res.status(200).json({ success: true, data: user });
});
