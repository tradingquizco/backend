import Account from "../../models/account.model.js";
import User from "../../models/user.model.js";
import Session from "../../models/session.model.js";
import Quiz from "../../models/quiz.model.js";
import ProfileModel from "../../models/images/profile.model.js";
import QuestionImage from "../../models/images/questionImage.model.js";
import AnswerImage from "../../models/images/answerImage.model.js";
import Pack from "../../models/pack.model.js";
import CoverPack from "../../models/images/coverPack.model.js";
import QuizPack from "../../models/quizPack.model.js";

export const SendRes = (res, status = 200, body = null) =>
  res.status(status).json(body);

export const CreateAssociations = () => {
  // Accounts
  Account.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
  Account.hasMany(Session, {
    foreignKey: "currentAccountId",
    onDelete: "CASCADE",
  });
  Account.hasMany(Quiz, { foreignKey: "creatorId", onDelete: "CASCADE" });
  Account.hasMany(Pack, { foreignKey: "creatorId", onDelete: "CASCADE" });
  Account.hasOne(ProfileModel, {
    foreignKey: "accountId",
    onDelete: "CASCADE",
  });

  // Session
  Session.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
  Session.belongsTo(Account, {
    foreignKey: "currentAccountId",
    onDelete: "CASCADE",
  });

  // Users
  User.hasMany(Session, { foreignKey: "userId", onDelete: "CASCADE" });
  User.hasMany(Account, { foreignKey: "userId", onDelete: "CASCADE" });

  // Quiz
  Quiz.belongsTo(Account, { foreignKey: "creatorId", onDelete: "CASCADE" });
  Quiz.hasOne(QuestionImage, { foreignKey: "quizId", onDelete: "CASCADE" });
  Quiz.hasOne(AnswerImage, { foreignKey: "quizId", onDelete: "CASCADE" });
  Quiz.belongsToMany(Pack, { through: QuizPack });

  // Pack
  Pack.belongsToMany(Quiz, { through: QuizPack });
  Pack.belongsTo(Account, { foreignKey: "creatorId", onDelete: "CASCADE" });
  
  // Question Image
  QuestionImage.belongsTo(Quiz, { foreignKey: "quizId", onDelete: "CASCADE" });

  // Answer Image
  AnswerImage.belongsTo(Quiz, { foreignKey: "quizId", onDelete: "CASCADE" });

  // Cover Pack
  CoverPack.belongsTo(Pack, { foreignKey: "cover", onDelete: "CASCADE" });

  // Profile
  ProfileModel.belongsTo(Account, {
    foreignKey: "accountId", // Ensuring foreign key matches Account model
    onDelete: "CASCADE",
  });
};
