import express from "express";
import messageRouter from "./router/message.js";
import userRouter from "./router/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(`/api/message`, messageRouter);
app.use(`/api/users`, userRouter);

app.use(
  cors({
    origin:  [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get(`/`, (req, res) => {
  res.send(`Welcome !@`);
});
