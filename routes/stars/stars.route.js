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
const {
  protected,
  adminAccess,
  apiKeyAccess,
} = require("../../middlewares/auth");

router.get("/", apiKeyAccess, getAllStars);
router.get("/:id", apiKeyAccess, getStarById);
router.post("/", protected, adminAccess, upload.single("image"), createNewStar);
router.put("/:id", protected, adminAccess, updateStar);
router.delete("/:id", protected, adminAccess, deleteStar);

module.exports = router;
