import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User',
        required: true
    },
    accountName: {type: String, required: true},
    accountType: {type: String, default: 'Savings'},
    currentBalance: Number,
    startingBalance: Number,
    monthlySavingGoal: Number,
    isDefault: {type: Boolean, default: false},
    budgetExceededNotifiedAt: Date,
    monthlyBudget: Number
})

const Account = mongoose.model('Account', accountSchema);

export default Account;