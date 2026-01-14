import mongoose from "mongoose";

const advisorChatSchema = new mongoose.Schema({
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
  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("AdvisorChat", advisorChatSchema);
