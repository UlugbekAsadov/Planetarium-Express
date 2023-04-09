const Planet = require("../../models/planet.model");
const Star = require("../../models/star.model");
const asyncHandler = require("../../middlewares/async");
const ErrorResponse = require("../../utils/error-response");
const { SUCCESS_MESSAGES } = require("../../utils/success-messages");

// @desc     Get all starts
// @route    GET /api/v1/planets
// @access   Public / with apiKey
exports.getAllPlanets = asyncHandler(async (req, res, next) => {
  const planets = await Planet.find();

  res.status(200).json({
    success: true,
    data: planets,
  });
});

// @desc     Create new planet
// @route    POST /api/v1/planets
// @access   Privete / with apiKey
exports.createNewPlanet = asyncHandler(async (req, res, next) => {
  const {
    name,
    distanceToStar,
    diametr,
    yearDuration,
    dayDuration,
    temperature,
    sequenceNumber,
    satellites,
    star,
  } = req.body;

  const foundedStar = await Star.findOne({ name: star });

  const newPlanet = await Planet.create({
    name,
    distanceToStar,
    diametr,
    yearDuration,
    dayDuration,
    temperature,
    sequenceNumber,
    satellites,
    image: "uploads/" + req.file.fileName,
    star: foundedStar._id,
  });

  await Star.findOneAndUpdate(
    { name: star },
    { $push: { planets: newPlanet._id } },
    { new: true, upsert: true }
  );

  res.status(201).json({
    success: true,
    data: newPlanet,
    message: SUCCESS_MESSAGES.Created,
  });
});

// @desc     Get Planet By Id
// @route    GET /api/v1/planets/:id
// @access   Private / Admin / with apiKey
exports.getPlanetById = asyncHandler(async (req, res, next) => {
  const planetId = req.params.id;

  const star = await Planet.findById(planetId);

  if (!star) {
    return next(new ErrorResponse("Planet not found", 404));
  }

  res.status(200).json({
    success: true,
    data: star,
  });
});

// @desc     Update planet By Id
// @route    PUT /api/v1/planet/:id
// @access   Private / Admin / with apiKey
exports.updatePlanet = asyncHandler(async (req, res, next) => {
  const planetId = req.params.id;
  const {
    name,
    distanceToStar,
    diametr,
    yearDuration,
    dayDuration,
    temperature,
    sequenceNumber,
    satellites,
    star,
  } = req.body;

  const planet = await Planet.findById(planetId);
  if (!planet) {
    return next(new ErrorResponse("Planet not found", 404));
  }

  const editedPlanet = {
    name: name || planet.name,
    distanceToStar: distanceToStar || planet.distanceToStar,
    diametr: diametr || planet.diametr,
    yearDuration: yearDuration || planet.yearDuration,
    dayDuration: dayDuration || planet.dayDuration,
    temperature: temperature || planet.temperature,
    sequenceNumber: sequenceNumber || planet.sequenceNumber,
    satellites: satellites || planet.satellites,
    star: star || planet.star,
  };

  const updatedPlanet = await Planet.findByIdAndUpdate(planetId, editedPlanet, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: updatedPlanet,
    message: SUCCESS_MESSAGES.Updated,
  });
});

// @desc     Delete star
// @route    DELETE /api/v1/stars/:id
// @access   Private / Admin / with apiKey
exports.deletePlanet = asyncHandler(async (req, res, next) => {
  const planetId = req.params.id;
  const planet = await Planet.findById(planetId);
  if (!planet) {
    return next(new ErrorResponse("Star not found", 404));
  }

  await Planet.findByIdAndRemove(planetId);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.Deleted,
  });
});
