import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: String},
    passwordHash: {type: String, unique: String},
    phone: Number,
    onboarding:{
        incomeRange: String,
        monthlyExpensesEstimate: Number,
        goal: String,
        monthlySavingTarget: Number,
        trackedCategories: [String]
    },
    hasCompletedOnboarding: {type: Boolean, default: false}
});

const User = mongoose.model('User', userSchema);
export default User;