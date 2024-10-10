import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const Account = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.INTEGER, // Ensure this is an INTEGER
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    profileUrl: { type: DataTypes.STRING, allowNull: true }, // You can remove profileId if you don't use it.
  },
  {
    modelName: "account",
    tableName: "accounts",
  }
);

export default Account;
