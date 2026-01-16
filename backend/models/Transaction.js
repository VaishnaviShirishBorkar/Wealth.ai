import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },

  title: String,

  category: {
    type: String,
    enum: [
      "Groceries",
      "Food",
      "Rent",
      "Travel",
      "Education",
      "Subscriptions",
      "Shopping",
      "Entertainment",
      "Fuel",
      "Medical",
      "Salary",
      "Misc",
      "Work",
      "Initial"
    ]
  },

  amount: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
