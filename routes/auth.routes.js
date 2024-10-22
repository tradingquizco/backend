import express from 'express'
import { login, register, sessionValidation } from '../controllers/auth.controller.js';

const router = express.Router();

router.route("/login").post(login)
router.route("/register").post(register);
router.route("/sessionValidation").post(sessionValidation);
export default router;