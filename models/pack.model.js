import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";
import Account from "./account.model.js";

const Pack = sequelize.define(
  "Pack",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coverImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    level: {
      type: DataTypes.ENUM("hard", "medium", "easy"),
      allowNull: false,
      defaultValue: "medium",
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    category: {
      type: DataTypes.ENUM("Technical Analysis", "Smart Money"),
      allowNull: false,
      defaultValue: "Technical Analysis",
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "packs",
    timestamps: true,
  }
);

export default Pack;
