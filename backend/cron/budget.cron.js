import cron from "node-cron";
import Account from "../models/Account.js";
import User from "../models/User.js";
import { checkBudgetAndNotify } from "../utils/budget.utils.js";

/**
 * Runs every Monday at 9 AM
 */
//"*/1 * * * *" -> for testing
cron.schedule("*/1 * * * *", async () => {
  console.log("🔁 Weekly budget check started");

  const accounts = await Account.find({
    monthlyBudget: { $exists: true, $ne: null }
  });

  for (const account of accounts) {
    const user = await User.findById(account.userId);
    if (!user) continue;

    await checkBudgetAndNotify(
      account,
      user.email,
      user._id
    );
  }

  console.log("✅ Weekly budget check completed");
});
