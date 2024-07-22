import express from "express";
import messageRouter from "./router/message.js";
import userRouter from "./router/user.js";
import cookieParser from "cookie-parser";
export const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(`/api/message`, messageRouter);
app.use(`/api/users`, userRouter);

app.get(`/`, (req, res) => {
  res.send(`Welcome !@`);
});
