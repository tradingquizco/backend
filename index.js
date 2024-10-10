import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { CreateAssociations } from "./util/helpers/index.js";
import sequelize from "./util/database.js";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
//rotuers
import userRoutes from "./routes/user.routes.js";
import accountRoutes from "./routes/account.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/images.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));

// sequelize.sync();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.post("/post", (req, res) => {
  res.json({});
  res.send(req.body);
});

app.get("/", (req, res) => {
  res.send({ message: "backend service successfully is running." });
});

CreateAssociations();
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("connect to database");
    app.listen(8080, () =>
      console.log("server listen to http://localhost:8080")
    );
  })
  .catch((err) => console.log(err));
