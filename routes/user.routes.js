import express from "express";
import {
  addPackToUserPacks,
  createUser,
  deleteUser,
  getAllUser,
  getUserByAccount,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../controllers/user.controllers.js";
// import {createUser, getAllUser, getUserByAccount, getUserByEmail, getUserById, updateUser} from '../controllers/user.controllers';

const router = express.Router();

router.route("/").post(createUser);
router.route("/").get(getAllUser);
router.route("/:id").get(getUserById);
router.route("/email/:email").get(getUserByEmail);
router.route("/account/:accountId").get(getUserByAccount);
router.route("/update/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);
router.route("/addPack").post(addPackToUserPacks)

export default router;
