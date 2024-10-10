import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import Session from "./session.model.js";

config();
const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("online", "offline"),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = parseInt(process.env.SALT, 10);
        if (!saltRounds) {
          throw new Error(
            "SALT environment variable is not defined or invalid."
          );
        }

        if (user.password) {
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const saltRounds = parseInt(process.env.SALT, 10);
          if (!saltRounds) {
            throw new Error(
              "SALT environment variable is not defined or invalid."
            );
          }
          if (user.password) {
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        }
      },
    },
  }
);

export default User;
