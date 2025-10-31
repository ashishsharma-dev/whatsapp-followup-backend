import mongoose from "mongoose"

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    messageStage: { type: Number, default: 0 },
    followUp1Sent: { type: Boolean, default: false },
    followUp2Sent: { type: Boolean, default: false },
    followUp3Sent: { type: Boolean, default: false },
    lastMessageAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Lead = mongoose.model("Lead", leadSchema)
