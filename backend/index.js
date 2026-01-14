import mongoose, { mongo } from 'mongoose'
import "./env.js";                  // 👈 FIRST
// import "./cron/budget.cron.js";     // 👈 AFTER env


import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import onboardingRoutes from './routes/onboarding.routes.js'
import accountRoutes from './routes/account.routes.js'
import transactionRoutes from './routes/transaction.routes.js'
import { sendBudgetExceededEmail } from './utils/email.utils.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/transaction", transactionRoutes);

// app.get("/test-email", async (req, res) => {
//   try {
    
//   await sendBudgetExceededEmail(
//     "borkarvaishnavi45@gmail.com",
//     23000,
//     25000
//   );
//   res.send("Email test done");
// }
// catch (error) {
//     console.log();
//     og
//   }
// });


// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log('Mongodb Connected!'))
// .catch((error) => console.log('DB Error: ', error));

/* ✅ CONNECT DB FIRST */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // 🔥 START CRON ONLY AFTER DB IS READY
    await import("./cron/budget.cron.js");
    console.log("⏰ Budget cron initialized");

  })
  .catch((error) => {
    console.error("❌ DB Error:", error);
    process.exit(1);
  });

app.listen(5001, () => console.log('Server running is 5001'));