const User = require("../../models/user.model");
const uuid = require("uuid");
const ErrorResponse = require("../../utils/error-response");
const asyncHandler = require("../../middlewares/async");
const { ERROR_MESSAGES } = require("../../utils/error-messages");
const { SUCCESS_MESSAGES } = require("../../utils/success-messages");
const bcrypt = require("bcryptjs");

// @desc     Register new user
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const apiKey = uuid.v4();

  const isUserExisted = await User.find({ email });

  if (isUserExisted.length) {
    return next(new ErrorResponse(ERROR_MESSAGES.UserAlreadyRegistrated, 403));
  }

  const user = await User.create({
    firstName,
    lastName,
    password,
    email,
    apiKey,
  });

  const token = await user.generateJwtToken();

  res.status(201).json({
    success: true,
    data: user,
    token,
  });
});

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(ERROR_MESSAGES.InvalidCredintials, 401));
  }

  //  Check for password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(ERROR_MESSAGES.InvalidCredintials, 401));
  }

  const token = await user.generateJwtToken();

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

// @desc     Get profile
// @route    POST /api/v1/auth/getProfile
// @access   Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  res.status(200).json({ success: true, data: user });
});

// @desc     Update profile
// @route    PUT /api/v1/auth/updateProfile
// @access   Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const fieldsToUpdate = {
    firstName: req.body.firstName || user.firstName,
    lastName: req.body.lastName || user.lastName,
    email: req.body.email || user.email,
  };

  const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
    message: SUCCESS_MESSAGES.Updated,
  });
});

// @desc     Update password
// @route    PUT /api/v1/auth/updatePassword
// @access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  const isOldPasswordMatch = await user.matchPassword(oldPassword);

  if (!isOldPasswordMatch) {
    return next(new ErrorResponse(ERROR_MESSAGES.IncorrectPassword, 403));
  }

  user.password = newPassword;
  await user.save();

  const token = await user.generateJwtToken();
  res.status(200).json({
    success: true,
    data: user,
    token,
    message: SUCCESS_MESSAGES.Updated,
  });
});

// @desc     Payment balace
// @route    PUT /api/v1/auth/payment
// @access   Private
exports.payment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { amount } = req.body;
  const user = await User.findById(userId);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { balance: user.balance + amount },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @desc     Activate Status
// @route    PUT /api/v1/auth/activate
// @access   Private
exports.activateStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const minAmountForUseApi = process.env.MIN_AMOUNT_FOR_USE_API;
  if (user.balance < minAmountForUseApi) {
    return next(new ErrorResponse(ERROR_MESSAGES.LackOfBalance, 403));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      balance: user.balance - minAmountForUseApi,
      isActive: true,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
    message: SUCCESS_MESSAGES.Updated,
  });
});
