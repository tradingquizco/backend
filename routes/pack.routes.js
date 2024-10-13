import express from 'express'
import { addQuizToPack, createPack, getAccountPacks, getAllPacks, updatePack } from '../controllers/pack.controller.js';
import { upload } from '../util/uploadConfig.js';

const router = express.Router();

router.route("/").post(upload.single("coverPack"), createPack);
router.route("/").get(getAllPacks)
router.route("/:accountId").get(getAccountPacks)
router.route("/update/:packId").patch(upload.single("coverPack"), updatePack)
router.route("/add").post(addQuizToPack)

export default router;