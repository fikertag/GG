import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  text: string;
  insultId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    insultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insult",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
