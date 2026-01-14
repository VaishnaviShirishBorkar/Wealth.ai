import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import fs from "fs";
import {GoogleGenAI} from '@google/genai';
import { checkBudgetAndNotify } from "../utils/budget.utils.js";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log('api key ', genAI);


/* =========================
   FETCH TRANSACTIONS
========================= */
export const getTransactionsByAccount = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req._id,
      accountId: req.params.accountId
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch transactions" });
  }
};

/* =========================
   CREATE TRANSACTION
========================= */

export const createTransaction = async (req, res) => {
  try {
    const { accountId, title, category, type, amount, date } = req.body;

    // console.log("CREATE TX BODY:", req.body);
    // console.log("USER ID:", req._id);

    const account = await Account.findById(accountId);
    // console.log("ACCOUNT FOUND:", account);

    if (!account) {
      return res.status(400).json({ msg: "Account not found" });
    }

    const transaction = await Transaction.create({
      userId: req._id,
      accountId,
      title,
      category,
      type,
      amount,
      date
    });

    account.currentBalance += type === "income" ? amount : -amount;
    await account.save();

        // 👇 BUDGET CHECK
    await checkBudgetAndNotify(
      account,
      req.userEmail,
      req._id
    );

    res.status(201).json(transaction);
  } catch (error) {
    console.error("CREATE TX ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};


/* =========================
   UPDATE TRANSACTION
========================= */
export const updateTransaction = async (req, res) => {
  try {
    const oldTx = await Transaction.findById(req.params.id);
    if (!oldTx) return res.status(404).json({ msg: "Transaction not found" });

    if(String(oldTx.userId) !== String(req._id))
      return res.status(403).json({msg: "Unauthorized"});

    const account = await Account.findById(oldTx.accountId);

    // revert old tx
    if(oldTx.type === 'income'){
      account.currentBalance -= oldTx.amount;
    }
    else{
      account.currentBalance += oldTx.amount;
    }

    const updatedTx = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // apply new tx
    if(updatedTx.type === 'income'){
      account.currentBalance += updatedTx.amount;
    }
    else{
      account.currentBalance -= updatedTx.amount;
    }

    await account.save();
    res.json(updatedTx);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update transaction" });
  }
};


/* =========================
   DELETE TRANSACTION
========================= */
export const deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ msg: "Transaction not found" });

    if (String(tx.userId) !== String(req._id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const account = await Account.findById(tx.accountId);

    if (tx.type === "income") {
      account.currentBalance -= tx.amount;
    } else {
      account.currentBalance += tx.amount;
    }

    await account.save();
    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ msg: "Transaction deleted!" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete transaction" });
  }
};


/* =========================
   FETCH SINGLE TRANSACTION
========================= */
export const getTransactionById = async (req, res) => {
  try {
    const tx = await Transaction.findOne({
      _id: req.params.id,
      userId: req._id
    });

    if (!tx) return res.status(404).json({ msg: "Transaction not found" });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch transaction" });
  }
};

export const extractImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ msg: "Gemini API key missing" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const imageBase64 = fs.readFileSync(req.file.path).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are a strict JSON generator.

              Extract transaction details from this bill image.
              Return ONLY valid JSON. No text. No markdown.

              {
                "title": string,
                "amount": number,
                "category": string,
                "type": "income" | "expense",
                "date": "YYYY-MM-DD"
              }
                            `
            },
            {
              inlineData: {
                data: imageBase64,
                mimeType: req.file.mimetype
              }
            }
          ]
        }
      ]
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Empty Gemini response:", response);
      return res.status(400).json({ msg: "Empty AI response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    } catch (err) {
      console.error("Raw Gemini response:", text);
      return res.status(400).json({
        msg: "Invalid AI response",
        raw: text
      });
    }

    fs.unlinkSync(req.file.path);
    res.json(parsed);

  } catch (error) {
    console.error("Gemini extraction error:", error);
    res.status(500).json({ msg: "Gemini extraction failed" });
  }
};