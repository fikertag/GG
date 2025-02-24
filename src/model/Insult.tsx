import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface
export interface IInsult extends Document {
  detail: string;
  comments: mongoose.Schema.Types.ObjectId[]; // Array of Comment references
  like: number;
  dislike: number;
  createdAt: Date;
  updatedAt: Date;
}

const InsultSchema = new Schema<IInsult>(
  {
    detail: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of Comment references
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Insult ||
  mongoose.model<IInsult>("Insult", InsultSchema);
