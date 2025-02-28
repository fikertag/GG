import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
  userHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 }, // Auto-delete after 60 sec
});

// Prevent re-registering the model
export default mongoose.models.RateLimit ||
  mongoose.model("RateLimit", RateLimitSchema);
