import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Member from "../models/Member.js";

/**
 * Calculate member summaries and the raw pairwise ledger for a group.
 *
 * @param {import("mongoose").Types.ObjectId|string} groupId - Group document ID.
 * @returns {Promise<{members: Array, ledger: Object}>} Ledger response data.
 */
export const calculateLedger = async (groupId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    return formatLedgerResponse(new Map(), new Map());
  }

  const members = await Member.find({ groupId }).select("_id name phone");
  const expenses = await Expense.find({ groupId });
  const { memberSummaries, pairwiseLedger } = initializeLedgerState(members);

  processExpenses(expenses, memberSummaries, pairwiseLedger);
  calculateMemberBalances(memberSummaries, pairwiseLedger);

  return formatLedgerResponse(memberSummaries, pairwiseLedger);
};

/**
 * Build the initial summary and pairwise ledger maps for all group members.
 *
 * @param {Array} members - Member documents for the group.
 * @returns {{memberSummaries: Map<string, Object>, pairwiseLedger: Map<string, Map<string, number>>}} Empty ledger state.
 */
const initializeLedgerState = (members) => {
  const memberSummaries = new Map();
  const pairwiseLedger = new Map();

  members.forEach((member) => {
    const memberId = member._id.toString();

    memberSummaries.set(memberId, createMemberSummary(member));
    pairwiseLedger.set(memberId, new Map());
  });

  return { memberSummaries, pairwiseLedger };
};

/**
 * Create the default ledger summary for a member.
 *
 * @param {Object} member - Member document.
 * @returns {Object} Member summary with zeroed integer monetary fields.
 */
const createMemberSummary = (member) => ({
  _id: member._id,
  name: member.name,
  phone: member.phone,
  totalPaid: 0,
  totalSpend: 0,
  owedToYou: 0,
  owedByYou: 0,
  netBalance: 0,
});

/**
 * Process every expense into member totals and pairwise ledger entries.
 *
 * @param {Array} expenses - Expense documents for the group.
 * @param {Map<string, Object>} memberSummaries - Member summary lookup.
 * @param {Map<string, Map<string, number>>} pairwiseLedger - Raw pairwise ledger.
 * @returns {void}
 */
const processExpenses = (expenses, memberSummaries, pairwiseLedger) => {
  if (expenses.length === 0 || memberSummaries.size === 0) {
    return;
  }

  expenses.forEach((expense) => {
    const payerId = expense.paidBy.toString();
    const payerSummary = memberSummaries.get(payerId);

    if (!payerSummary) {
      return;
    }

    const validParticipants = getValidParticipants(
      expense.participants,
      memberSummaries
    );

    updateMemberTotals(
      payerSummary,
      validParticipants,
      memberSummaries
    );

    buildPairwiseLedger(payerId, validParticipants, pairwiseLedger);
  });
};

/**
 * Keep only participants that still belong to the current member set.
 *
 * @param {Array} participants - Expense participant subdocuments.
 * @param {Map<string, Object>} memberSummaries - Member summary lookup.
 * @returns {Array} Participants with active group members.
 */
const getValidParticipants = (participants, memberSummaries) =>
  participants.filter((participant) =>
    memberSummaries.has(participant.memberId.toString())
  );

/**
 * Update totalPaid for the payer and totalSpend for participants.
 *
 * @param {Object} payerSummary - Summary object for the payer.
 * @param {Array} participants - Valid expense participant subdocuments.
 * @param {Map<string, Object>} memberSummaries - Member summary lookup.
 * @returns {void}
 */
const updateMemberTotals = (
  payerSummary,
  participants,
  memberSummaries
) => {
  const paidAmount = sumParticipantAmounts(participants);

  payerSummary.totalPaid += paidAmount;

  participants.forEach((participant) => {
    const participantId = participant.memberId.toString();
    const participantSummary = memberSummaries.get(participantId);

    participantSummary.totalSpend += participant.amountOwed;
  });
};

/**
 * Build raw pairwise balances for each expense.
 *
 * Positive amount means the other member owes this member.
 * Negative amount means this member owes the other member.
 *
 * @param {string} payerId - Member ID of the payer.
 * @param {Array} participants - Valid expense participant subdocuments.
 * @param {Map<string, Map<string, number>>} pairwiseLedger - Raw pairwise ledger.
 * @returns {void}
 */
const buildPairwiseLedger = (payerId, participants, pairwiseLedger) => {
  participants.forEach((participant) => {
    const participantId = participant.memberId.toString();

    if (participantId === payerId) {
      return;
    }

    addPairwiseAmount(
      pairwiseLedger,
      payerId,
      participantId,
      participant.amountOwed
    );
  });
};

/**
 * Add a symmetric pairwise ledger amount between payer and participant.
 *
 * @param {Map<string, Map<string, number>>} pairwiseLedger - Raw pairwise ledger.
 * @param {string} creditorId - Member who is owed money.
 * @param {string} debtorId - Member who owes money.
 * @param {number} amount - Integer amount in the smallest currency unit.
 * @returns {void}
 */
const addPairwiseAmount = (pairwiseLedger, creditorId, debtorId, amount) => {
  const creditorLedger = pairwiseLedger.get(creditorId);
  const debtorLedger = pairwiseLedger.get(debtorId);

  creditorLedger.set(debtorId, (creditorLedger.get(debtorId) || 0) + amount);
  debtorLedger.set(creditorId, (debtorLedger.get(creditorId) || 0) - amount);
};

/**
 * Sum participant owed amounts using integer arithmetic only.
 *
 * @param {Array} participants - Valid expense participant subdocuments.
 * @returns {number} Total participant amount in the smallest currency unit.
 */
const sumParticipantAmounts = (participants) =>
  participants.reduce((sum, participant) => sum + participant.amountOwed, 0);

/**
 * Calculate owed totals and net balances from the pairwise ledger.
 *
 * @param {Map<string, Object>} memberSummaries - Member summary lookup.
 * @param {Map<string, Map<string, number>>} pairwiseLedger - Raw pairwise ledger.
 * @returns {void}
 */
const calculateMemberBalances = (memberSummaries, pairwiseLedger) => {
  memberSummaries.forEach((summary, memberId) => {
    const memberLedger = pairwiseLedger.get(memberId);

    memberLedger.forEach((amount) => {
      if (amount > 0) {
        summary.owedToYou += amount;
        return;
      }

      if (amount < 0) {
        summary.owedByYou += Math.abs(amount);
      }
    });

    summary.netBalance = summary.totalPaid - summary.totalSpend;
  });
};

/**
 * Convert internal maps into the exact JSON-safe service response shape.
 *
 * @param {Map<string, Object>} memberSummaries - Member summary lookup.
 * @param {Map<string, Map<string, number>>} pairwiseLedger - Raw pairwise ledger.
 * @returns {{members: Array, ledger: Object}} Formatted ledger response.
 */
const formatLedgerResponse = (memberSummaries, pairwiseLedger) => ({
  members: Array.from(memberSummaries.values()),
  ledger: formatPairwiseLedger(pairwiseLedger),
});

/**
 * Convert Map<memberId, Map<memberId, number>> to a plain object.
 *
 * @param {Map<string, Map<string, number>>} pairwiseLedger - Raw pairwise ledger.
 * @returns {Object} JSON-safe pairwise ledger.
 */
const formatPairwiseLedger = (pairwiseLedger) => {
  const ledger = {};

  pairwiseLedger.forEach((memberLedger, memberId) => {
    ledger[memberId] = {};

    memberLedger.forEach((amount, otherMemberId) => {
      ledger[memberId][otherMemberId] = amount;
    });
  });

  return ledger;
};
