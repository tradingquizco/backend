import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const QuizPack = sequelize.define(
  "QuizPack",
  {
    // quizId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true, // Set as part of the primary key
    //   references: {
    //     model: "Quiz", // Ensure the model name matches the defined model
    //     key: "id",
    //   },
    //   onDelete: "CASCADE", // Optional: define the delete behavior
    //   onUpdate: "CASCADE", // Optional: define the update behavior
    // },
    // packId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true, // Set as part of the primary key
    //   references: {
    //     model: "Pack", // Ensure the model name matches the defined model
    //     key: "id",
    //   },
    //   onDelete: "CASCADE", // Optional: define the delete behavior
    //   onUpdate: "CASCADE", // Optional: define the update behavior
    // },
  },
  {
    timestamps: false,
    tableName: "QuizPack",
  }
);

export default QuizPack;