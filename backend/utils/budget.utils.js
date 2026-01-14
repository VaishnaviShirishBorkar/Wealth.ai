import Transaction from "../models/Transaction.js";
import { sendBudgetExceededEmail } from "./email.utils.js";

const getMonthRange = () => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setMonth(end.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const checkBudgetAndNotify = async (account, userEmail, userId) => {
  if (!account.monthlyBudget) return;

  const { start, end } = getMonthRange();

  const result = await Transaction.aggregate([
    {
      $match: {
        accountId: account._id,
        userId,
        type: "expense",
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  const spent = result[0]?.total || 0;
  const budget = account.monthlyBudget;

  const spentPercent = (spent / budget) * 100;

  console.log("📊 Budget check:", {
    accountId: account._id,
    spent,
    budget,
    percent: spentPercent
  });

  const alreadyNotifiedThisMonth =
    account.budgetWarningNotifiedAt &&
    account.budgetWarningNotifiedAt >= start;

  // 🔥 ONE condition ONLY
  if (spent > account.monthlyBudget && !alreadyNotifiedThisMonth) {
    await sendBudgetExceededEmail(userEmail, spent, budget);

    account.budgetWarningNotifiedAt = new Date();
    await account.save();
  }
};
