import mongoose from "mongoose";
import Member from "../models/Member.js";

/**
 * Validate an expense split and convert request participants into the model
 * shape. It intentionally preserves the existing API validation messages.
 *
 * @param {Object} options - Expense split input.
 * @param {import("mongoose").Types.ObjectId|string} options.groupId - Owning group ID.
 * @param {number} options.totalAmount - Expense total in integer currency units.
 * @param {"EQUAL"|"AMOUNT"} options.splitType - Requested split type.
 * @param {Array} options.participants - Request participant payload.
 * @returns {Promise<{participants?: Array, message?: string}>} Normalized participants or a validation message.
 */
export const buildExpenseParticipants = async ({
  groupId,
  totalAmount,
  splitType,
  participants,
}) => {
  if (participants.length === 0) {
    return { message: "At least one participant is required" };
  }

  if (splitType === "EQUAL") {
    if (participants.some((memberId) => !mongoose.isValidObjectId(memberId))) {
      return { message: "Invalid participant" };
    }

    const groupParticipants = await Member.find({
      _id: { $in: participants },
      groupId,
    });

    if (groupParticipants.length !== participants.length) {
      return { message: "All participants must belong to this group" };
    }

    const baseAmount = Math.floor(totalAmount / participants.length);
    const remainder = totalAmount % participants.length;

    return {
      participants: participants.map((memberId, index) => ({
        memberId,
        amountOwed: baseAmount + (index < remainder ? 1 : 0),
        isIncluded: true,
        settled: false,
      })),
    };
  }

  const hasInvalidParticipant = participants.some(
    (participant) =>
      !participant.memberId ||
      !mongoose.isValidObjectId(participant.memberId) ||
      !Number.isInteger(participant.amountOwed) ||
      participant.amountOwed < 0
  );

  if (hasInvalidParticipant) return { message: "Invalid participant" };

  const participantIds = participants.map((participant) => participant.memberId);
  const groupParticipants = await Member.find({
    _id: { $in: participantIds },
    groupId,
  });

  if (groupParticipants.length !== participantIds.length) {
    return { message: "All participants must belong to this group" };
  }

  const totalOwed = participants.reduce(
    (sum, participant) => sum + participant.amountOwed,
    0
  );

  if (totalOwed !== totalAmount) {
    return { message: "Participant amounts must equal total amount" };
  }

  return {
    participants: participants.map((participant) => ({
      memberId: participant.memberId,
      amountOwed: participant.amountOwed,
      isIncluded: participant.amountOwed > 0,
      settled: false,
    })),
  };
};
