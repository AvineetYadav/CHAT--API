import express from "express";
import messageRouter from "./router/message.js";
import userRouter from "./router/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
export const app = express();
config({
  path: "./db/.env",
});

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(`/api/message`, messageRouter);
app.use(`/api/users`, userRouter);

app.get(`/`, (req, res) => {
  res.send(`Welcome !@`);
});
