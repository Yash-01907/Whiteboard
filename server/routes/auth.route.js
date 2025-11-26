import Router from "express";
import { googleAuthHandler } from "../controllers/auth.controller.js";
const router = Router();

router.post("/google",googleAuthHandler );

export default router;
