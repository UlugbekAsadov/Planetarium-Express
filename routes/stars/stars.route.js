const { Router } = require("express");
const {
  createNewStar,
  getAllStars,
  getStarById,
  updateStar,
  deleteStar,
} = require("../../controllers/stars/star.controller");
const upload = require("../../utils/file-upload");
const router = Router();

router.get("/", getAllStars);
router.get("/:id", getStarById);
router.post("/", upload.single("image"), createNewStar);
router.put("/:id", updateStar);
router.delete("/:id", deleteStar);

module.exports = router;
