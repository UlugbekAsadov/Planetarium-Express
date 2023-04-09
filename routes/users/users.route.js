const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
} = require("../../controllers/users/users.controller");
const {
  protected,
  adminAccess,
  apiKeyAccess,
} = require("../../middlewares/auth");

const userRouter = Router();

userRouter.get("/", protected, getAllUsers);
userRouter.get("/:id", protected, getUserById);

module.exports = userRouter;
