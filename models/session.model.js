import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const Session = sequelize.define(
  "session",
  {
    sessionData: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { modelName: "session", tableName: "sessions" }
);



export default Session;
