const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/error-response");
const User = require("../models/user.model");
const { ERROR_MESSAGES } = require("../utils/error-messages");

// Protecting routes
exports.protected = asyncHandler(async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse(ERROR_MESSAGES.NotAuthorized), 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});

// Grand access to admins
exports.adminAccess = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ErrorResponse(ERROR_MESSAGES.NotAccess, 403));
  }

  next();
};

// API key access
exports.apiKeyAccess = asyncHandler(async (req, res, next) => {
  const key = req.headers["apikey"] || null;

  if (!key) {
    return next(new ErrorResponse(ERROR_MESSAGES.NoApiKey, 403));
  }

  const user = await User.findOne({ apiKey: key });

  // check if user exist
  if (!user) next(new ErrorResponse(ERROR_MESSAGES.UserNotFound, 400));

  if (!user.isActive)
    next(new ErrorResponse(ERROR_MESSAGES.UserStatusNotActive, 400));

  next();
});
