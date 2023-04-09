const { Router } = require("express");
const {
  getAllPlanets,
  createNewPlanet,
  getPlanetById,
  updatePlanet,
  deletePlanet,
} = require("../../controllers/planets/planet.controller");
const upload = require("../../utils/file-upload");
const router = Router();
const { protected, adminAccess } = require("../../middlewares/auth");

router.get("/", getAllPlanets);
router.get("/:id", getPlanetById);
router.post("/", upload.single("image"), createNewPlanet);
router.put("/:id", protected, updatePlanet);
router.delete("/:id", protected, adminAccess, deletePlanet);

module.exports = router;
