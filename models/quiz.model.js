import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";
import Account from "./account.model.js";

const { STRING, ENUM, INTEGER } = DataTypes;

const Quiz = sequelize.define("quiz", {
  
  title: {
    type: STRING,
    allowNull: false,
    defaultValue: "",
  },
  description: {
    type: STRING,
    allowNull: false,
    defaultValue: "",
  },
  questionText: {
    type: STRING,
    allowNull: false,
    defaultValue: "",
  },
  answer: {
    type: STRING,
    allowNull: false,
    defaultValue: "",
  },
  options: {
    type: STRING,
    allowNull: false,
    defaultValue: "",
  },
  questionImgUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  answerImgUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  creatorId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key: "id",
    },
  },
});

export default Quiz;
