import "../env.js";          // 👈 MUST BE FIRST
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("MONGO_URI =", process.env.MONGO_URI);
/* ======================================
   CONFIG
====================================== */
const USER_ID = "69450cb50515e9a269413b85";
const ACCOUNT_ID = "6969e0f2c42d89cc705090bb";

/* ======================================
   HELPERS
====================================== */
const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const makeDate = (year, month, day) =>
  new Date(Date.UTC(year, month - 1, day, random(9, 18)));

/* ======================================
   MONTH CONFIG (Oct–Dec)
====================================== */
const months = [
  { y: 2025, m: 10 },
  { y: 2025, m: 11 },
  { y: 2025, m: 12 }
];

/* ======================================
   SEED GENERATION
====================================== */
const txs = [];

months.forEach(({ y, m }) => {

  // Salary
  txs.push({
    userId: USER_ID,
    accountId: ACCOUNT_ID,
    title: "Monthly Salary",
    category: "Salary",
    type: "income",
    amount: 45000,
    date: makeDate(y, m, 1)
  });

  // Rent
  txs.push({
    userId: USER_ID,
    accountId: ACCOUNT_ID,
    title: "House Rent",
    category: "Rent",
    type: "expense",
    amount: 10500,
    date: makeDate(y, m, 2)
  });

  // Subscriptions
  [
    ["Netflix", 499],
    ["Spotify", 199],
    ["Amazon Prime", 149]
  ].forEach(([title, amount]) => {
    txs.push({
      userId: USER_ID,
      accountId: ACCOUNT_ID,
      title,
      category: "Subscriptions",
      type: "expense",
      amount,
      date: makeDate(y, m, 5)
    });
  });

  // Weekly groceries (4–5 weeks)
  [6, 13, 20, 27].forEach(d => {
    txs.push({
      userId: USER_ID,
      accountId: ACCOUNT_ID,
      title: "Grocery Shopping",
      category: "Groceries",
      type: "expense",
      amount: random(1200, 2200),
      date: makeDate(y, m, d)
    });
  });

  // Fuel (weekly)
  [8, 15, 22, 29].forEach(d => {
    txs.push({
      userId: USER_ID,
      accountId: ACCOUNT_ID,
      title: "Petrol",
      category: "Fuel",
      type: "expense",
      amount: random(700, 1100),
      date: makeDate(y, m, d)
    });
  });

  // Food orders (7–9 per month)
  for (let i = 0; i < 8; i++) {
    txs.push({
      userId: USER_ID,
      accountId: ACCOUNT_ID,
      title: "Swiggy / Zomato",
      category: "Food",
      type: "expense",
      amount: random(300, 700),
      date: makeDate(y, m, random(3, 28))
    });
  }

  // Shopping (4 per month)
  for (let i = 0; i < 4; i++) {
    txs.push({
      userId: USER_ID,
      accountId: ACCOUNT_ID,
      title: "Amazon / Flipkart",
      category: "Shopping",
      type: "expense",
      amount: random(2000, 6000),
      date: makeDate(y, m, random(6, 26))
    });
  }

  // Medical
  txs.push({
    userId: USER_ID,
    accountId: ACCOUNT_ID,
    title: "Doctor Visit",
    category: "Medical",
    type: "expense",
    amount: random(800, 2500),
    date: makeDate(y, m, random(10, 25))
  });

  // Entertainment
  txs.push({
    userId: USER_ID,
    accountId: ACCOUNT_ID,
    title: "Movie / Event",
    category: "Entertainment",
    type: "expense",
    amount: random(400, 1200),
    date: makeDate(y, m, random(7, 24))
  });
});

/* ======================================
   CLEAN + INSERT
====================================== */
await Transaction.deleteMany({ accountId: ACCOUNT_ID });
await Transaction.insertMany(txs);

console.log(`✅ Inserted ${txs.length} transactions`);

/* ======================================
   BALANCE RECALCULATION
====================================== */
let balance = 0;
txs.forEach(tx => {
  balance += tx.type === "income" ? tx.amount : -tx.amount;
});

await Account.findByIdAndUpdate(ACCOUNT_ID, {
  currentBalance: balance
});

console.log("✅ Account balance synced");
process.exit();
