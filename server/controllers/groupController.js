import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Member from "../models/Member.js";
import { calculateLedger } from "../services/ledger.service.js";

export const createGroup = async (req, res) => {
  try {
    console.log(req.body);
    const { tripName, adminName, phone, adminPassword } = req.body;

    if (!tripName || !adminName || !phone || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const inviteCode = nanoid(8);

    // Create Group
    const group = await Group.create({
      tripName,
      adminPassword: hashedPassword,
      inviteCode,
    });

    // Create Admin as First Member
    await Member.create({
      groupId: group._id,
      name: adminName,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: {
        groupId: group._id,
        tripName: group.tripName,
        inviteCode: group.inviteCode,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the group
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check duplicate name
    const existingName = await Member.findOne({
      groupId: group._id,
      name,
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "This name is already taken in this group",
      });
    }

    // Check duplicate phone
    const existingPhone = await Member.findOne({
      groupId: group._id,
      phone,
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "This phone number is already taken in this group",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create member
    const member = await Member.create({
      groupId: group._id,
      name,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Joined group successfully",
      data: {
        memberId: member._id,
        name: member.name,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the group
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Find member
    const member = await Member.findOne({
      groupId: group._id,
      phone,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, member.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        memberId: member._id,
        groupId: group._id,
        name: member.name,
        phone: member.phone,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupDashboard = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    // Find the group
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Fetch group members
    const members = await Member.find({ groupId: group._id }).select("_id name");

    return res.status(200).json({
      success: true,
      data: {
        groupId: group._id,
        tripName: group.tripName,
        status: group.status,
        members,
        summary: {
          totalGroupExpense: 0,
          owedByYou: 0,
          owedToYou: 0,
        },
        recentExpenses: [],
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { memberId, reason, totalAmount, splitType, participants } = req.body;

    if (
      !memberId ||
      !reason ||
      !totalAmount ||
      !splitType ||
      !participants
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      !Number.isInteger(totalAmount) ||
      totalAmount <= 0 ||
      typeof reason !== "string" ||
      !reason.trim() ||
      !["EQUAL", "AMOUNT"].includes(splitType) ||
      !Array.isArray(participants)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense details",
      });
    }

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid memberId",
      });
    }

    // Find the group
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Find paying member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (member.groupId.toString() !== group._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Member does not belong to this group",
      });
    }

    let expenseParticipants = [];

    if (splitType === "EQUAL") {
      if (participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one participant is required",
        });
      }

      const hasInvalidParticipant = participants.some(
        (participantId) => !mongoose.isValidObjectId(participantId)
      );

      if (hasInvalidParticipant) {
        return res.status(400).json({
          success: false,
          message: "Invalid participant",
        });
      }

      console.log("Group ID:", group._id);
      console.log("Participants:", participants);
      console.log(
        "Participant Types:",
        participants.map((participant) => ({
          value: participant,
          type: typeof participant,
        }))
      );
      console.log("Query Values:", {
        ids: participants,
        groupId: group._id,
      });

      const groupParticipants = await Member.find({
        _id: { $in: participants },
        groupId: group._id,
      });

      console.log("Found Participants:", groupParticipants.length);
      console.log(
        "Participant IDs Found:",
        groupParticipants.map((participant) => ({
          id: participant._id,
          groupId: participant.groupId,
          name: participant.name,
        }))
      );

      if (groupParticipants.length !== participants.length) {
        return res.status(400).json({
          success: false,
          message: "All participants must belong to this group",
        });
      }

      const baseAmount = Math.floor(totalAmount / participants.length);
      const remainder = totalAmount % participants.length;

      expenseParticipants = participants.map((participantId, index) => ({
        memberId: participantId,
        amountOwed: baseAmount + (index < remainder ? 1 : 0),
        isIncluded: true,
        settled: false,
      }));
    }

    if (splitType === "AMOUNT") {
      if (participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one participant is required",
        });
      }

      const hasInvalidParticipant = participants.some(
        (participant) =>
          !participant.memberId ||
          !mongoose.isValidObjectId(participant.memberId) ||
          !Number.isInteger(participant.amountOwed) ||
          participant.amountOwed < 0
      );

      if (hasInvalidParticipant) {
        return res.status(400).json({
          success: false,
          message: "Invalid participant",
        });
      }

      const participantIds = participants.map(
        (participant) => participant.memberId
      );

      const groupParticipants = await Member.find({
        _id: { $in: participantIds },
        groupId: group._id,
      });

      if (groupParticipants.length !== participantIds.length) {
        return res.status(400).json({
          success: false,
          message: "All participants must belong to this group",
        });
      }

      const totalOwed = participants.reduce(
        (sum, participant) => sum + participant.amountOwed,
        0
      );

      if (totalOwed !== totalAmount) {
        return res.status(400).json({
          success: false,
          message: "Participant amounts must equal total amount",
        });
      }

      expenseParticipants = participants.map((participant) => ({
        memberId: participant.memberId,
        amountOwed: participant.amountOwed,
        isIncluded: participant.amountOwed > 0,
        settled: false,
      }));
    }

    const expense = await Expense.create({
      groupId: group._id,
      reason,
      totalAmount,
      paidBy: memberId,
      splitType,
      participants: expenseParticipants,
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: {
        expenseId: expense._id,
        reason: expense.reason,
        totalAmount: expense.totalAmount,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    // Find the group
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const expenses = await Expense.find({ groupId: group._id })
      .sort({ createdAt: -1 })
      .populate("paidBy", "_id name")
      .populate("participants.memberId", "_id name");

    return res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { memberId, reason, totalAmount, splitType, participants } = req.body;

    if (!mongoose.isValidObjectId(expenseId)) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (
      !memberId ||
      !reason ||
      !totalAmount ||
      !splitType ||
      !participants
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      !Number.isInteger(totalAmount) ||
      totalAmount <= 0 ||
      typeof reason !== "string" ||
      !reason.trim() ||
      !["EQUAL", "AMOUNT"].includes(splitType) ||
      !Array.isArray(participants)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense details",
      });
    }

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid memberId",
      });
    }

    // Find paying member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (expense.paidBy.toString() !== memberId) {
      return res.status(403).json({
        success: false,
        message: "Only the user who created this expense can edit it",
      });
    }

    let expenseParticipants = [];

    if (splitType === "EQUAL") {
      if (participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one participant is required",
        });
      }

      const hasInvalidParticipant = participants.some(
        (participantId) => !mongoose.isValidObjectId(participantId)
      );

      if (hasInvalidParticipant) {
        return res.status(400).json({
          success: false,
          message: "Invalid participant",
        });
      }

      const groupParticipants = await Member.find({
        _id: { $in: participants },
        groupId: expense.groupId,
      });

      if (groupParticipants.length !== participants.length) {
        return res.status(400).json({
          success: false,
          message: "All participants must belong to this group",
        });
      }

      const baseAmount = Math.floor(totalAmount / participants.length);
      const remainder = totalAmount % participants.length;

      expenseParticipants = participants.map((participantId, index) => ({
        memberId: participantId,
        amountOwed: baseAmount + (index < remainder ? 1 : 0),
        isIncluded: true,
        settled: false,
      }));
    }

    if (splitType === "AMOUNT") {
      if (participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one participant is required",
        });
      }

      const hasInvalidParticipant = participants.some(
        (participant) =>
          !participant.memberId ||
          !mongoose.isValidObjectId(participant.memberId) ||
          !Number.isInteger(participant.amountOwed) ||
          participant.amountOwed < 0
      );

      if (hasInvalidParticipant) {
        return res.status(400).json({
          success: false,
          message: "Invalid participant",
        });
      }

      const participantIds = participants.map(
        (participant) => participant.memberId
      );

      const groupParticipants = await Member.find({
        _id: { $in: participantIds },
        groupId: expense.groupId,
      });

      if (groupParticipants.length !== participantIds.length) {
        return res.status(400).json({
          success: false,
          message: "All participants must belong to this group",
        });
      }

      const totalOwed = participants.reduce(
        (sum, participant) => sum + participant.amountOwed,
        0
      );

      if (totalOwed !== totalAmount) {
        return res.status(400).json({
          success: false,
          message: "Participant amounts must equal total amount",
        });
      }

      expenseParticipants = participants.map((participant) => ({
        memberId: participant.memberId,
        amountOwed: participant.amountOwed,
        isIncluded: participant.amountOwed > 0,
        settled: false,
      }));
    }

    expense.reason = reason;
    expense.totalAmount = totalAmount;
    expense.splitType = splitType;
    expense.participants = expenseParticipants;

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: {
        expenseId: expense._id,
        reason: expense.reason,
        totalAmount: expense.totalAmount,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { memberId } = req.body;

    if (!mongoose.isValidObjectId(expenseId)) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid memberId",
      });
    }

    // Find member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (expense.paidBy.toString() !== memberId) {
      return res.status(403).json({
        success: false,
        message: "Only the user who created this expense can delete it",
      });
    }

    await Expense.findByIdAndDelete(expenseId);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupLedger = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    // Find the group
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const { members, ledger } = await calculateLedger(group._id);

    return res.status(200).json({
      success: true,
      data: {
        members,
        ledger,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
