import express from "express";
import {
  deleteExpense,
  updateExpense,
} from "../controllers/groupController.js";

const router = express.Router();

router.put("/:expenseId", updateExpense);
router.delete("/:expenseId", deleteExpense);

export default router;
