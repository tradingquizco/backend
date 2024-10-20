import sequelize from "../util/database.js";
import { DataTypes } from "sequelize";
import Pack from "./pack.model.js";

// Define the AccountPack join table
const AccountPack = sequelize.define(
  "AccountPack",
  {
    // accountId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'accounts',
    //     key: 'id',
    //   },
    //   onDelete: "CASCADE"
    // },
    // packId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'packs',
    //     key: 'id',
    //   },
    //   onDelete: "CASCADE"
    // }
  },
  {
    modelName: "AccountPack",
    tableName: "AccountPack",
  }
);

export default AccountPack;