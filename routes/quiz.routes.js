import express from 'express'
import { createQuiz, deleteQuiz, getAllQuiz, getPackQuizzes, getQuizByID, submitQuiz, updateQuiz } from '../controllers/quiz.controller.js';
import { upload } from '../util/uploadConfig.js';

const router = express.Router();

router.route("/").get(getAllQuiz);
router.route("/:id").get(getQuizByID)
router.route("/").post(upload.fields([{ name: 'questionImage'}, { name: 'answerImage' },]),createQuiz);
router.route("/update/:id").patch(upload.fields([{ name: 'questionImage'}, { name: 'answerImage' },]),updateQuiz);
router.route("/:id").delete(deleteQuiz);
router.route("/submit").post(submitQuiz);
router.route("/submit/:accountId/:quizId").get()
router.route("/pack/:packId").get(getPackQuizzes)

export default router;