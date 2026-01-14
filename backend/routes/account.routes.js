import express from 'express'
import {createAccount, deletedAccount, financialAdvisorChat, getAccounts, updateAccount, getAdvisorChat, getAccount} from '../controller/account.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = express.Router();

router.post("/create", verifyToken, createAccount);
router.get("/fetch", verifyToken, getAccounts);
router.get("/:id", verifyToken, getAccount);
router.put("/:id", verifyToken, updateAccount);
router.delete("/:id", verifyToken, deletedAccount);
router.post("/:id/advisor/chat", verifyToken, financialAdvisorChat);
router.get("/:id/advisor/chat", verifyToken, getAdvisorChat);

export default router;