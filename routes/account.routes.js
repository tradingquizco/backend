import express from 'express'
import { createAccount, DeleteAccount, IsAccountValid } from '../controllers/account.controller.js';

const router = express.Router();

router.route("/").post(createAccount);
router.route("/:id").delete(DeleteAccount);
router.route("/validation-account").post(IsAccountValid)

export default router;