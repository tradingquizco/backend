import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";

const InviteModel = sequelize.define(
  "InviteModel",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    inviter: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    invited: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { modelName: "InviteModel", tableName: "Invites" }
);

export default InviteModel;
