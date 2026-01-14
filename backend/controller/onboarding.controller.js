import User from "../models/User.js";

export const saveOnboarding = async(req, res) => {
    try {
        const data = req.body.data;
        
    await User.findByIdAndUpdate(req._id, {
        onboarding: data,
        hasCompletedOnboarding: true
    });

    res.json({msg: "Saved successfully"});
    } catch (error) {
        res.status(501).json({msg: error});
    }
}