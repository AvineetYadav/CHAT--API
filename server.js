import { config } from "dotenv";
import { connectDB } from "./db/database.js";
import { app } from "./app.js";
import cors from "cors";
import express from "express";

app.use(express.json());
config({
  path: "./db/.env",
});
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    method: [`GET`, `POST`, `PUT`, `DELETE`],
    credentials: true,
  })
);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
