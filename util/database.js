import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();
const sequelize = new Sequelize(
  "tradingquiz",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: "mysql",
  }
);
export default sequelize;
