import { DataTypes } from "sequelize";
import sequelize from "../util/database.js";
import bcrypt from "bcryptjs";
import User from "./user.model.js";

const Session = sequelize.define(
  "session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sessionToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    modelName: "session",
    tableName: "sessions",
    hooks: {
      beforeCreate: async (session) => {
        const saltRounds = parseInt(process.env.SALT, 10);
        if (!saltRounds) {
          throw new Error(
            "SALT environment variable is not defined or invalid."
          );
        }

        if (session.sessionToken || session.sessionToken !== "") {
          session.sessionToken = await bcrypt.hash(
            session.sessionToken,
            saltRounds
          );
        }
      },
      beforeUpdate: async (session) => {
        if (session.changed("sessionToken") || session.sessionToken !== "") {
          const saltRounds = parseInt(process.env.SALT, 10);
          if (!saltRounds) {
            throw new Error(
              "SALT environment variable is not defined or invalid."
            );
          }
          session.sessionToken = await bcrypt.hash(
            session.sessionToken,
            saltRounds
          );
        }
      },
    },
  }
);

export default Session;
