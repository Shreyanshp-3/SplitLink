/**
 * Generate the minimum set of payments required to settle group balances.
 * This function is pure: it does not mutate the supplied members or write to
 * the database.
 *
 * @param {Array<{_id: import("mongoose").Types.ObjectId|string, name: string, phone?: string, netBalance: number}>} members - Ledger member summaries.
 * @returns {Array<{from: {_id: import("mongoose").Types.ObjectId|string, name: string}, to: {_id: import("mongoose").Types.ObjectId|string, name: string}, amount: number}>} Settlement instructions.
 */
export const generateSettlements = (members) => {
  const creditors = members
    .filter((member) => member.netBalance > 0)
    .map((member) => ({ ...member, remainingBalance: member.netBalance }));
  const debtors = members
    .filter((member) => member.netBalance < 0)
    .map((member) => ({ ...member, remainingBalance: Math.abs(member.netBalance) }));
  const settlements = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = Math.min(creditor.remainingBalance, debtor.remainingBalance);

    settlements.push({
      from: { _id: debtor._id, name: debtor.name },
      to: { _id: creditor._id, name: creditor.name },
      amount,
    });

    creditor.remainingBalance -= amount;
    debtor.remainingBalance -= amount;

    if (creditor.remainingBalance === 0) creditorIndex += 1;
    if (debtor.remainingBalance === 0) debtorIndex += 1;
  }

  return settlements;
};
