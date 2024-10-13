import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";
import Account from "./account.model.js";

const Pack = sequelize.define(
  "Pack",
  {
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
      type: DataTypes.ENUM("hard", "medium", "easy"), // Removed empty string from ENUM
      allowNull: false,
      defaultValue: "medium", // Set a default level
    },
    isFree: {
      type: DataTypes.BOOLEAN, // Use BOOLEAN instead of TINYINT(1)
      allowNull: false,
      defaultValue: false, // Default value can be set to false
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0, // Set a default price
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
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

export default Pack;
