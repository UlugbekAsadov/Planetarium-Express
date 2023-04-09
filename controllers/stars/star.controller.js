const Star = require("../../models/star.model");
const asyncHandler = require("../../middlewares/async");
const ErrorResponse = require("../../utils/error-response");
const { SUCCESS_MESSAGES } = require("../../utils/success-messages");

// @desc     Get all starts
// @route    GET /api/v1/stars
// @access   Public / with apiKey
exports.getAllStars = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const total = await Star.countDocuments();

  const stars = await Star.find()
    .skip(page * limit - limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    totalPage: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: stars,
  });
});

// @desc     Get Star By Id
// @route    GET /api/v1/stars/:id
// @access   Private / with apiKey
exports.getStarById = asyncHandler(async (req, res, next) => {
  const starId = req.params.id;

  const star = await Star.findById(starId);

  if (!star) {
    return next(new ErrorResponse("Star not found", 404));
  }

  res.status(200).json({
    success: true,
    data: star,
  });
});

// @desc     Create new starts
// @route    POST /api/v1/stars
// @access   Private / Admin / with apiKey
exports.createNewStar = asyncHandler(async (req, res, next) => {
  const newStar = await Star.create({
    name: req.body.name,
    temperature: req.body.temperature,
    massa: req.body.massa,
    diametr: req.body.diametr,
    image: "uploads/" + req.file.filename,
  });

  res.status(200).json({
    success: true,
    data: newStar,
  });
});

// @desc     Update star By Id
// @route    PUT /api/v1/stars/:id
// @access   Private / Admin / with apiKey
exports.updateStar = asyncHandler(async (req, res, next) => {
  const starId = req.params.id;
  const star = await Star.findById(starId);
  if (!star) {
    return next(new ErrorResponse("Star not found", 404));
  }

  const editedStar = {
    name: req.body.name || star.name,
    temperature: req.body.temperature || star.temperature,
    massa: req.body.massa || star.massa,
    diametr: req.body.diametr || star.diametr,
    image: req.body.image || star.image,
  };

  const updatedStar = await Star.findByIdAndUpdate(starId, editedStar, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: updatedStar,
  });
});

// @desc     Delete star
// @route    DELETE /api/v1/stars/:id
// @access   Private / Admin / with apiKey
exports.deleteStar = asyncHandler(async (req, res, next) => {
  const starId = req.params.id;
  const star = await Star.findById(starId);
  if (!star) {
    return next(new ErrorResponse("Star not found", 404));
  }

  await Star.findByIdAndRemove(starId);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.Deleted,
  });
});
