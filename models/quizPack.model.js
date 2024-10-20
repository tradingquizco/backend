import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const QuizPack = sequelize.define(
  "QuizPack",
  {},
  {
    tableName: "QuizPack",
  }
);

export default QuizPack;
