import express from "express";
import messageRouter from "./router/message.js";
import userRouter from "./router/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
export const app = express();
dotenv.config();

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(`/api/message`, messageRouter);
app.use(`/api/users`, userRouter);

app.get(`/`, (req, res) => {
  res.send(`Welcome !@`);
});
