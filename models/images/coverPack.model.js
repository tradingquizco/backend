import { DataTypes } from "sequelize";
import sequelize from "../../util/database.js";

const CoverPack = sequelize.define(
  "coverPaxk",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "CoverPack",
  }
);

export default CoverPack;
