import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },        // e.g., 'spend', 'visits', 'lastActiveDays'
  operator: { type: String, required: true },     // e.g., '>', '<', '==', '>=', 'includes'
  value: { type: mongoose.Schema.Types.Mixed },   // e.g., 10000, 3, 90
});

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: {
    type: [
      {
        conditionType: { type: String, enum: ['AND', 'OR'], required: true },
        conditions: [ruleSchema], // Array of rule objects
      }
    ],
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  audienceSize: { type: Number, default: 0 },
  stats: {
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;