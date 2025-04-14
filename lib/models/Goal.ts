import mongoose, { Schema } from "mongoose";

const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Goal name is required"],
      trim: true,
    },
    color: {
      type: String,
      default: "blue",
      enum: [
        "blue",
        "green",
        "purple",
        "yellow",
        "pink",
        "orange",
        "red",
        "gray",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
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

export default mongoose.models.Goal || mongoose.model("Goal", goalSchema);
