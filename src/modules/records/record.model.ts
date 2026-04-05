import mongoose, { Schema, Document } from "mongoose";

export type RecordType = "income" | "expense";

export interface IRecord extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
  isDeleted: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes for performance 🚀
recordSchema.index({ userId: 1, isDeleted: 1, date: -1 });
recordSchema.index({ category: 1 });
recordSchema.index({ type: 1 });

export const RecordModel = mongoose.model<IRecord>(
  "Record",
  recordSchema
);