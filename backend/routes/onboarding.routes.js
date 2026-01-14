import { saveOnboarding } from "../controller/onboarding.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import express from 'express'

const router = express.Router();

router.post("/save", verifyToken, saveOnboarding);

export default router;