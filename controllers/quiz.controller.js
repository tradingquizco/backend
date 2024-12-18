import Account from "../models/account.model.js";
import AnswerImage from "../models/images/answerImage.model.js";
import QuestionImage from "../models/images/questionImage.model.js";
import Pack from "../models/pack.model.js";
import Quiz from "../models/quiz.model.js";
import QuizAttempts from "../models/quizAttempts.model.js";
import Session from "../models/session.model.js";
import CalculatePackPrice from "../util/helpers/calculatePackPrice.js";
import GetQuizPrice from "../util/helpers/getQuizPrice.js";
import { SendRes } from "../util/helpers/index.js";

export const createQuiz = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const {
    title,
    description,
    questionText,
    answer,
    options,
    level,
    packId,
    sessionId,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !questionText ||
    !answer ||
    !options ||
    !sessionId ||
    !packId ||
    !req.files["questionImage"][0] ||
    !req.files["answerImage"][0]
  ) {
    return SendRes(res, 409, { message: "All fields required" });
  }

  try {
    const pack = await Pack.findOne({ where: { id: packId } });
    if (!pack) {
      return SendRes(res, 404, { message: "Pack not found" });
    }

    const packQuizzes = await pack.getQuizzes();
    if (packQuizzes.length >= 25)
      return SendRes(res, 400, { message: "You Hit Limit of This Pack" });

    const session = await Session.findByPk(sessionId, {
      include: { model: Account },
    });
    const account = session.account;

    const quiz = await Quiz.create({
      title,
      description,
      questionText,
      answer,
      options,
      level,
      creatorId: account.id,
    });

    const questionImg = await QuestionImage.create({
      url: req.files["questionImage"][0].filename,
      quizId: quiz.id,
    });
    const answerImg = await AnswerImage.create({
      url: req.files["answerImage"][0].filename,
      quizId: quiz.id,
    });

    const updatedQuiz = await quiz.update(
      {
        questionImgUrl: questionImg.url,
        answerImgUrl: answerImg.url,
      },
      {
        returning: true,
      }
    );

    if (!pack.isFree) {
      const newPrice = await GetQuizPrice(pack);
      await pack.update({ price: Number(pack.price + newPrice) });
    }

    pack.addQuiz(updatedQuiz);
    return SendRes(res, 200, updatedQuiz);
  } catch (err) {
    console.error(err);
    return SendRes(res, 500, { message: "Internal server error" });
  }
};

export const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const updatedQuizData = req.body; // Use a clearer variable name

  if (
    JSON.stringify(updatedQuizData) === "{}" &&
    !req.files?.["questionImage"] &&
    !req.files?.["answerImage"]
  ) {
    SendRes(res, 400, { message: "You Should Change At Least One Property" });
    return;
  }

  try {
    // Find the existing quiz
    const quiz = await Quiz.findOne({ where: { id } });
    if (!quiz) return SendRes(res, 404, { message: "Quiz not found" });

    // Update the quiz with the new data and/or images
    const updatedQuiz = await quiz.update(
      {
        ...updatedQuizData, // Spread the updated quiz data
        questionImgUrl: req.files?.["questionImage"]
          ? req.files["questionImage"][0].filename // Use the new question image if uploaded
          : quiz.dataValues.questionImgUrl, // Otherwise, keep the old image
        answerImgUrl: req.files?.["answerImage"]
          ? req.files["answerImage"][0].filename // Use the new answer image if uploaded
          : quiz.dataValues.answerImgUrl, // Otherwise, keep the old image
      },
      { returning: true } // Ensure the updated object is returned
    );

    SendRes(res, 200, updatedQuiz);
  } catch (err) {
    console.error(err);
    SendRes(res, 500, { message: "Internal server error" });
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

export const getSubmitInfo = async (req, res) => {
  const sessionId = req.query.sessionId;
  const quizId = req.query.quizId;

  if (!quizId || !sessionId) {
    return SendRes(res, 409, { message: "All fields required" });
  }

  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: Account },
    });
    const account = session.account;
    if (!account) return SendRes(res, 404, { message: "Account Not Found" });

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) return SendRes(res, 404, { message: "Quiz Not Found" });

    const submitInfo = await QuizAttempts.findOne({
      where: { quizId, accountId: account.id },
    });
    SendRes(res, 200, submitInfo);
  } catch (err) {
    SendRes(res, 500, { message: "Internal server error" });
  }
};

export const submitQuiz = async (req, res) => {
  const { quizId, sessionId, selectedOption, isCurrect } = req.body;
  if (!quizId || !sessionId || !selectedOption || isCurrect === null) {
    SendRes(res, 409, { message: "All fields required" });
    return;
  }
  try {
    const session = await Session.findByPk(sessionId, {
      include: { model: Account },
    });
    const account = session.account;
    if (!account) return SendRes(res, 404, { message: "Account Not Found" });

    const [newQuizAttempt, isCreated] = await QuizAttempts.findOrCreate({
      where: { quizId, accountId: account.id },
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

export const getPackQuizzes = async (req, res) => {
  const { packId } = req.params;

  try {
    const pack = await Pack.findByPk(packId, {
      include: [
        {
          model: Quiz,
          include: [
            {
              model: Account,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    if (!pack) {
      return SendRes(res, 404, { message: "Pack not found" });
    }
    // Map the quizzes to add 'username' and 'packId' to each quiz object
    const quizzesWithUsername = pack.quizzes.map((quiz) => ({
      ...quiz.toJSON(), // Convert Sequelize object to plain JSON
      username: quiz.account.username, // Add the 'username' field
      packId: packId, // Add the 'packId'
    }));

    SendRes(res, 200, quizzesWithUsername);
  } catch (err) {
    console.log(err);
    SendRes(res, 500, { message: "Internal server error" });
  }
};
