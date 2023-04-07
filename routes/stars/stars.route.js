const { Router } = require("express");
const {
  createNewStar,
  getAllStars,
  getStarById,
  updateStar,
} = require("../../controllers/stars/star.controller");
const router = Router();

router.get("/", getAllStars);
router.get("/:id", getStarById);
router.post("/", createNewStar);
router.put("/:id", updateStar);

module.exports = router;
