const User = require("../../models/user.model");
const uuid = require("uuid");
const ErrorResponse = require("../../utils/error-response");
const asyncHandler = require("../../middlewares/async");

exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const apiKey = uuid.v4();

  const user = await User.create({
    firstName,
    lastName,
    password,
    email,
    apiKey,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});
