import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    category: String,
    date: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
