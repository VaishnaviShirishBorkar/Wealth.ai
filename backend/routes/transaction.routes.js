import express from "express";
import {
  getTransactionById,
  getTransactionsByAccount,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controller/transaction.controller.js";
import multer from 'multer'
import { extractImage } from "../controller/transaction.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({dest: "uploads/"});

router.get("/account/:accountId", verifyToken, getTransactionsByAccount);
router.get("/:id", verifyToken, getTransactionById);
router.post("/create", verifyToken, createTransaction);
router.put("/:id/edit", verifyToken, updateTransaction);
router.delete("/:id/delete", verifyToken, deleteTransaction);
router.post("/extract", verifyToken, upload.single("image"), extractImage);

export default router;
