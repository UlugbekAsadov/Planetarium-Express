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
const {
  protected,
  adminAccess,
  apiKeyAccess,
} = require("../../middlewares/auth");

router.get("/", apiKeyAccess, getAllPlanets);
router.get("/:id", apiKeyAccess, getPlanetById);
router.post(
  "/",
  protected,
  adminAccess,
  upload.single("image"),
  createNewPlanet
);
router.put("/:id", protected, adminAccess, updatePlanet);
router.delete("/:id", protected, adminAccess, deletePlanet);

module.exports = router;
