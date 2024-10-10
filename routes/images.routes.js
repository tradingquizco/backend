// routes/imageRoutes.js
import express from "express";
import { upload } from "../util/uploadConfig.js";
import { uploadAnswerImage, uploadProfileImage, uploadQuestionImage } from "../controllers/images.controller.js";

const router = express.Router();

router.post("/questionImage", upload.single("questionImage"), uploadQuestionImage);
router.post("/answerImage", upload.single("answerImage"), uploadAnswerImage);
router.post("/profileImage", upload.single("profileImage"), uploadProfileImage);

export default router;