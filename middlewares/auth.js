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
  if (!req.user.adminStatus) {
    return next(new ErrorResponse(ERROR_MESSAGES.NotAccess, 403));
  }

  next();
};
