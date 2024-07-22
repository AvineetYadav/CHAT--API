import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logout,
} from "../controllers/User.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isAuthenticated, getUserProfile);
router.post(`/logout`, logout);

export default router;
