import Account from "../models/Account.js";
import {GoogleGenAI} from '@google/genai';
import Transaction from "../models/Transaction.js";
import AdvisorChat from '../models/AdvisorChat.js'

// export const createAccount = async(req, res) => {
//     try {
//         const {accountName, accountType, startingBalance, monthlySavingGoal,isDefault} = req.body;
//         const userId = req._id;

//         const account = await Account.create({
//             userId,
//             accountName, 
//             accountType, 
//             currentBalance: startingBalance, 
//             monthlySavingGoal,
//             isDefault,
//         });

//         console.log(req.body);
        

//             // 🔥 Opening balance created ONCE
//     if (startingBalance > 0) {
//       await Transaction.create({
//         userId: req._id,
//         accountId: account._id,
//         title: "Opening Balance",
//         category: "Initial",
//         type: "income",
//         amount: Number(startingBalance),
//         date: new Date()
//       });
//     }

//     console.log('Account ',account);
    

//         res.status(201).json(account);

//     } catch (error) {
//         res.status(500).json({msg: "Internal server error"});
//     }
// }

export const createAccount = async (req, res) => {
  try {
    const {
      accountName,
      accountType,
      startingBalance = 0,
      monthlySavingGoal = 0,
      isDefault = false
    } = req.body;

    const userId = req._id;

    const numericStartingBalance = Number(startingBalance);

    if (isNaN(numericStartingBalance)) {
      return res.status(400).json({ msg: "Invalid starting balance" });
    }

    // 1️⃣ Create account
    const account = await Account.create({
      userId,
      accountName,
      accountType,
      currentBalance: numericStartingBalance,
      monthlySavingGoal: Number(monthlySavingGoal),
      isDefault
    });

    // 2️⃣ Create opening transaction ONCE
    if (numericStartingBalance > 0) {
      await Transaction.create({
        userId,
        accountId: account._id,
        title: "Opening Balance",
        category: "Initial",
        type: "income",
        amount: numericStartingBalance,
        date: new Date()
      });
    }

    // 3️⃣ Return created account
    res.status(201).json(account);

  } catch (error) {
    console.error("CREATE ACCOUNT ERROR:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const getAccounts = async(req, res) => {
    try {
        const userId = req._id;
        const accounts = await Account.find({userId});

        res.status(201).json(accounts);
        
    } catch (error) {
         res.status(500).json({msg: "Internal server error"});
    }
}

export const getAccount = async(req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req._id
    });

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.status(201).json(account);

  } catch (error) {
     res.status(500).json({msg: "Internal server error"});
  }
}

export const updateAccount = async(req, res) => {
    try {
        const {id} = req.params;

        const updated = await Account.findByIdAndUpdate(id, req.body, {new: true});

        res.json(updated);
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
    }
}

export const deletedAccount = async(req, res) => {
    try {
        const {id} = req.params;
        const userId = req._id;

        const account = await Account.findOne({_id: id, userId});
        if(!account)
          return res.status(404).json({msg: "Account not found"});

        // Delete all transactions
        await Transaction.deleteMany({accountId: id, userId});

        await Account.findByIdAndDelete(id);

         res.json({ msg: "Account deleted also all its transactions" });
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
    }
} 

export const getAdvisorChat = async(req, res) => {
  try {
    const chat = await AdvisorChat.findOne({
    userId: req._id,
    accountId: req.params.id
  });

  res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
  }
}

export const financialAdvisorChat = async (req, res) => {
  try {
    const { messages } = req.body;
    const { id: accountId } = req.params;
    const userId = req._id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ msg: "Gemini API key missing" });
    }

    /* 1️⃣ Load or create chat */
    let chat = await AdvisorChat.findOne({ userId, accountId });

    if (!chat) {
      chat = await AdvisorChat.create({
        userId,
        accountId,
        messages: []
      });
    }

    /* 2️⃣ Financial summary (90 days) */
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 90);

    const txs = await Transaction.find({
      userId,
      accountId,
      date: { $gte: fromDate }
    });

    let income = 0;
    let expense = 0;
    const categoryMap = {};

    txs.forEach(tx => {
      if (tx.type === "income") income += tx.amount;
      else {
        expense += tx.amount;
        categoryMap[tx.category] =
          (categoryMap[tx.category] || 0) + tx.amount;
      }
    });

    const systemPrompt = `
You are a personal financial advisor.

User Financial Summary (last 90 days):
- Income: ₹${income}
- Expenses: ₹${expense}
- Savings: ₹${income - expense}

Expense Breakdown:
${JSON.stringify(categoryMap, null, 2)}

Rules:
- Be practical
- Be supportive
- Warn about overspending
- Suggest realistic improvements
- Ask follow-up questions
`;

    /* 3️⃣ Append latest user message */
    const latestUserMessage = messages[messages.length - 1];
    chat.messages.push(latestUserMessage);

    /* 4️⃣ Build Gemini input */
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...chat.messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }))
    ];

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(400).json({ msg: "Empty AI response" });
    }

    /* 5️⃣ Save assistant reply */
    chat.messages.push({
      role: "assistant",
      content: reply
    });

    await chat.save();

    res.json({
      messages: chat.messages
    });

  } catch (error) {
    console.error("Advisor Error:", error);
    res.status(500).json({ msg: "Advisor Failed" });
  }
};
