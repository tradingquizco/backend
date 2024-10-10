import { DataTypes } from "sequelize";
import sequelize from "../util/database";

const Image = sequelize.define("image", {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data: {
    type: DataTypes.BLOB("long"),
    allowNull: false,
  },
}, {tableName: "images"});

export default Image;
