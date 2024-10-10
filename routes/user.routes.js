import express from "express";
import {
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
router.route("/account").get(getUserByAccount);
router.route("/update/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);

export default router;
