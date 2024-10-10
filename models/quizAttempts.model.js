import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";
import Account from "./account.model.js";
import Quiz from "./quiz.model.js";

const QuizAttempts = sequelize.define("quiz-attempt", {
    selectedOption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCurrect: {type: DataTypes.BOOLEAN, allowNull: false},
    submitDate: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {modelName: "QuizAttempts", tableName: "quizAttempts"});

QuizAttempts.belongsTo(Account, {foreignKey: "accountId", onDelete:"CASCADE"})
QuizAttempts.belongsTo(Quiz, {foreignKey: "quizId", onDelete:"CASCADE"})

export default QuizAttempts;