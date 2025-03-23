import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({});
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Heloo from coursesHb Backend");
});
const PORT = process.env.PORT || 3000;
app.use("/api/v1/user/", userRouter);
app.listen(PORT, () => {
  connectDB();
  console.log(`server stated at ${PORT}`);
});
