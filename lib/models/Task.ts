import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    goalId: Schema.Types.ObjectId,
    dueDate: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
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

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
