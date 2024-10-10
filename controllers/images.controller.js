import AnswerImage from "../models/images/answerImage.model.js";
import ProfileModel from "../models/images/profile.model.js";
import QuestionImage from "../models/images/questionImage.model.js";

export const uploadQuestionImage = async (req, res) => {
  try {
    const { quizId } = req.body;
    const questionImage = await QuestionImage.create({
      url: req.file.path,
      quizId,
    });
    res
      .status(201)
      .json({
        message: "Question image uploaded successfully",
        data: questionImage,
      });
  } catch (error) {
    res.status(500).json({ message: "Error uploading question image", error });
  }
};
export const uploadAnswerImage = async (req, res) => {
  try {
    const { quizId } = req.body;
    const answerImage = await AnswerImage.create({
      url: req.file.path,
      quizId,
    });
    res
      .status(201)
      .json({
        message: "Answer image uploaded successfully",
        data: answerImage,
      });
  } catch (error) {
    res.status(500).json({ message: "Error uploading answer image", error });
  }
};
export const uploadProfileImage = async (req, res) => {
  try {
    const { accountId } = req.body;
    const profileImage = await ProfileModel.create({
      url: req.file.path,
      accountId,
    });
    res
      .status(201)
      .json({
        message: "Profile image uploaded successfully",
        data: profileImage,
      });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile image", error });
  }
};
