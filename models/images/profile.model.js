import { DataTypes } from "sequelize";
import sequelize from "../../util/database.js";

const ProfileModel = sequelize.define(
  "profile-images",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "profileImages",
  }
);

export default ProfileModel;
