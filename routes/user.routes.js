import express from "express";
import {
  addPackToUserPacks,
  createUser,
  deleteUser,
  getAllUser,
  getUserByAccount,
  getUserByEmail,
  getUserById,
  getUserInviteCode,
  inviteUser,
  numberOfInvites,
  updateUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/").post(createUser);
router.route("/").get(getAllUser);
router.route("/:id").get(getUserById);
router.route("/email/:email").get(getUserByEmail);
router.route("/account/:accountId").get(getUserByAccount);
router.route("/update/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);
router.route("/addPack").post(addPackToUserPacks)
router.route("/invite").post(inviteUser);
router.route("/numberOfInvites/:sessionId").get(numberOfInvites);
router.route("/inviteCode/:sessionId").get(getUserInviteCode)

export default router;
