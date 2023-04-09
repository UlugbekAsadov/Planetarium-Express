const { Router } = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  payment,
  activateStatus,
} = require("../../controllers/auth/auth.controller");
const { protected } = require("../../middlewares/auth");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getProfile", protected, getProfile);
router.put("/updateProfile", protected, updateProfile);
router.put("/updatePassword", protected, updatePassword);
router.put("/payment", protected, payment);
router.put("/activateStatus", protected, activateStatus);

module.exports = router;
