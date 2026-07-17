import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    splitType: {
      type: String,
      enum: ["EQUAL", "AMOUNT"],
      required: true,
    },

    participants: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
          required: true,
        },

        amountOwed: {
          type: Number,
          required: true,
        },

        isIncluded: {
          type: Boolean,
          default: true,
        },

        settled: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Expense", expenseSchema);
