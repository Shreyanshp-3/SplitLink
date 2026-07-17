import express from "express";
import {
  addExpense,
  createGroup,
  getAllExpenses,
  getGroupDashboard,
  joinGroup,
  loginMember,
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/", createGroup);
router.post("/:inviteCode/join", joinGroup);
router.post("/:inviteCode/login", loginMember);
router.post("/:inviteCode/expenses", addExpense);
router.get("/:inviteCode/expenses", getAllExpenses);
router.get("/:inviteCode/", getGroupDashboard);

export default router;
