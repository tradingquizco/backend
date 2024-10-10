import AnswerImage from "../models/images/answerImage.model.js";
import QuestionImage from "../models/images/questionImage.model.js";
import Quiz from "../models/quiz.model.js";
import QuizAttempts from "../models/quizAttempts.model.js";
import { SendRes } from "../util/helpers/index.js";

export const createQuiz = async (req, res) => {
  const {
    title,
    description,
    questionText,
    answer,
    option,
    level,
    creatorId
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !questionText ||
    !answer ||
    !option ||
    !option.length === 0 ||
    !creatorId ||
    !level ||
    !["hard", "medium", "easy"].includes(level) ||
    !req.files['questionImage'][0] ||
    !req.files['answerImage'][0]
  ) {
    console.log( Number(session.currentAccountId));
    return SendRes(res, 409, { message: "All fields required" });
  }

  try {
    const quiz = await Quiz.create({
      title,
      description,
      questionText,
      answer,
      option: option.join(","),
      level,
      creatorId,
    });

    console.log(req.body)

    const questionImg = await QuestionImage.create({
      url: req.files['questionImage'][0].path,
      quizId: quiz.id,
    });
    const answerImg = await AnswerImage.create({
      url: req.files['answerImage'][0].path,
      quizId: quiz.id,
    });

    // Update quiz with image URLs
    const updatedQuiz = await quiz.update(
      {
        questionImgUrl: questionImg.url,
        answerImgUrl: answerImg.url,
      },
      {
        returning: true,
      }
    );

    // Send success response
    return SendRes(res, 200, updatedQuiz);
  } catch (err) {
    console.error(err); // Log the error for debugging
    return SendRes(res, 500, { message: "Internal server error" });
  }
};

export const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const updatedQuiz = req.body;

  try {
    const existing = await Quiz.findOne({ where: { id } });
    if (!existing) return SendRes(res, 404, { message: "Quiz not found" });

    await Quiz.update(updateQuiz, { where: { id } });
    const quiz = await Quiz.findOne({ where: { id } });
    SendRes(res, 200, quiz);
  } catch (err) {
    SendRes(res, 500, { message: "Interanl server error" });
  }
};

export const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    await Quiz.destroy({ where: { id } });
    SendRes(res, 200, { message: "Quiz successfully deleted" });
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const submitQuiz = async (req, res) => {
  const { quizId, userId, selectedOption, submitDate, isCurrect } = req.body;
  if (
    !quizId ||
    !userId ||
    !selectedOption ||
    !submitDate ||
    isCurrect === null
  ) {
    SendRes(res, 409, { message: "All fields required" });
    return;
  }
  try {
    const [newQuizAttempt, isCreated] = await QuizAttempts.findOrCreate({
      where: { quizId, userId, submitDate },
      defaults: { isCurrect, selectedOption },
    });
    SendRes(res, 200, newQuizAttempt);
  } catch (err) {
    SendRes(res, 500, { message: "Internal message" });
  }
};

export const getAllQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    SendRes(res, 200, quizzes);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const getQuizByID = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findOne({ where: { id } });
    SendRes(res, 200, quiz);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};
