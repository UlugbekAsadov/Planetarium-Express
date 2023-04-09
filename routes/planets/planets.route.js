const { Router } = require("express");
const {
  getAllPlanets,
  createNewPlanet,
  getPlanetById,
  updatePlanet,
  deletePlanet
} = require("../../controllers/planets/planet.controller");
const upload = require("../../utils/file-upload");
const router = Router();

router.get("/", getAllPlanets);
router.get("/:id", getPlanetById);
router.post("/", upload.single("image"), createNewPlanet);
router.put("/:id", updatePlanet);
router.delete("/:id", deletePlanet);

module.exports = router;
