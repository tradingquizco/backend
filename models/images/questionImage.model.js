import { DataTypes } from "sequelize";
import sequelize from "../../util/database.js";

const QuestionImage = sequelize.define(
  "question-images",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "questionImages" }
);

export default QuestionImage;
