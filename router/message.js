import express from "express";
const router = express.Router();
import { getMessages, postMessage } from "../controllers/Message.js";
import { isAuthenticated } from "../middlewares/auth.js";

router.get(`/`,  isAuthenticated,getMessages);

router.post(`/`, isAuthenticated,postMessage);

export default router;
