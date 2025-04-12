import mongoose, { Schema } from "mongoose";

const goalSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    color: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Goal || mongoose.model("Goal", goalSchema);
