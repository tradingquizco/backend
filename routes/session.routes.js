import express from "express";
import {
  createSession,
  deleteSession,
  getSessionBySessionToken,
  updatedSessionBySessionToken,
} from "../controllers/session.controller.js";

const router = express.Router();

router.route("/").post(createSession);
router.route("/:sessionToken").get(getSessionBySessionToken);
router.route("/update/:sessionToken").patch(updatedSessionBySessionToken);
router.route("/:id").delete(deleteSession)

export default router;
