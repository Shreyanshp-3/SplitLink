import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      required: true,
      trim: true,
    },

    adminPassword: {
      type: String,
      required: true,
    },

    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
    type: String,
    enum: ["OPEN", "CLOSED"],
    default: "OPEN"
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Group", groupSchema);