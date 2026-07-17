# Expense Split Feature — Model & Algorithms

Mirrors GPay's "Split Evenly" + "Split by Amount" flow, plus a balance ledger
(Owed to you / Owed by you / Total spend). Split-by-shares and split-by-%
are intentionally left out.

---

## 1. Data Models

```ts
// ---------- Core entities ----------

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface Group {
  id: string;
  name: string;
  memberIds: string[];      // userIds
  createdBy: string;
  createdAt: Date;
}

// One expense = one payment event, split among N participants
interface Expense {
  id: string;
  groupId?: string;         // null if it's a 1:1 (non-group) split
  reason: string;           // "Dinner at XYZ", note/description
  totalAmount: number;      // store in paisa/cents (integer) to avoid float issues
  paidBy: string;           // userId who actually paid
  splitType: "EQUAL" | "AMOUNT";
  createdAt: Date;
  participants: ExpenseParticipant[]; // computed split, see below
}

// Per-user share of a given expense
interface ExpenseParticipant {
  expenseId: string;
  userId: string;
  isIncluded: boolean;      // false = deselected from equal split
  amountOwed: number;       // this user's share (in paisa)
  settled: boolean;         // has this share been paid back
}

// Pairwise net ledger — the thing that powers "owed to/by you"
// balances[A][B] = amount B owes A (can be negative = A owes B)
interface Balance {
  userA: string;
  userB: string;
  netAmount: number;        // positive => userB owes userA
}

// Optional: when someone actually pays back (settle up)
interface Settlement {
  id: string;
  fromUser: string;         // payer of the settlement
  toUser: string;
  amount: number;
  expenseId?: string;       // optional link if settling one specific expense
  createdAt: Date;
}
```

**Why paisa/cents as integers?** Floating point splits (₹100/3) break equality
checks. Always compute in the smallest currency unit, convert to rupees only
for display.

---

## 2. Split Evenly Algorithm

GPay behavior: all group members pre-selected → user can uncheck people who
shouldn't be part of this split → remaining amount divided equally, with
leftover paisa distributed one-by-one so the sum always matches exactly.

```js
function splitEqually(totalAmountPaisa, selectedUserIds) {
  const n = selectedUserIds.length;
  if (n === 0) throw new Error("At least one participant required");

  const base = Math.floor(totalAmountPaisa / n);
  const remainder = totalAmountPaisa - base * n; // leftover paisa, 0..n-1

  return selectedUserIds.map((userId, idx) => ({
    userId,
    isIncluded: true,
    // first `remainder` users get 1 extra paisa so totals reconcile exactly
    amountOwed: base + (idx < remainder ? 1 : 0),
    settled: false,
  }));
}
```

Deselected members simply aren't in `selectedUserIds` — they get an
`ExpenseParticipant` row with `isIncluded: false, amountOwed: 0` (or no row
at all, your choice) so the UI still shows them greyed out.

---

## 3. Split by Amount Algorithm

User manually enters each person's share. You just need strict validation —
this is where most bugs happen.

```js
function splitByAmount(totalAmountPaisa, entries) {
  // entries = [{ userId, amountPaisa }]
  const sum = entries.reduce((acc, e) => acc + e.amountPaisa, 0);

  if (sum !== totalAmountPaisa) {
    return {
      valid: false,
      diff: totalAmountPaisa - sum, // show this to user: "₹X unassigned" or "over by ₹X"
    };
  }

  return {
    valid: true,
    participants: entries.map(e => ({
      userId: e.userId,
      isIncluded: e.amountPaisa > 0,
      amountOwed: e.amountPaisa,
      settled: false,
    })),
  };
}
```

UX tip (matches GPay): show a live "remaining to assign" counter as the user
types each amount, and disable the submit button until `diff === 0`.

---

## 4. Balance Ledger — the core algorithm

This is what answers "owed to you" / "owed by you" / "total spend" for every
user, and it's the same mechanism Splitwise uses internally.

### Update on expense creation

When an expense is created, everyone except the payer owes the payer their
`amountOwed`. Update the pairwise ledger:

```js
function applyExpenseToLedger(expense, ledger) {
  // ledger: Map<string, Map<string, number>>  ledger[A][B] = amount B owes A
  const payer = expense.paidBy;

  for (const p of expense.participants) {
    if (!p.isIncluded || p.userId === payer) continue;

    addDebt(ledger, /*creditor*/ payer, /*debtor*/ p.userId, p.amountOwed);
  }
}

function addDebt(ledger, creditor, debtor, amount) {
  ensure(ledger, creditor, debtor);
  ensure(ledger, debtor, creditor);

  ledger.get(creditor).set(debtor, ledger.get(creditor).get(debtor) + amount);
  ledger.get(debtor).set(creditor, ledger.get(debtor).get(creditor) - amount);
}

function ensure(ledger, a, b) {
  if (!ledger.has(a)) ledger.set(a, new Map());
  if (!ledger.get(a).has(b)) ledger.get(a).set(b, 0);
}
```

### Update on settlement (someone pays back)

```js
function applySettlement(settlement, ledger) {
  // fromUser is paying toUser back -> reduces what fromUser owes toUser
  addDebt(ledger, settlement.fromUser, settlement.toUser, -settlement.amount);
}
```

### Deriving "Owed to you" / "Owed by you" / "Total spend"

```js
function getUserSummary(userId, ledger, allExpenses) {
  const row = ledger.get(userId) || new Map();

  let owedToYou = 0;   // others owe you
  let owedByYou = 0;   // you owe others

  for (const net of row.values()) {
    if (net > 0) owedToYou += net;
    else owedByYou += -net;
  }

  // "Total spend" = sum of YOUR share across all expenses you took part in
  // (not the total bill amount, just your slice of it)
  const totalSpend = allExpenses
    .flatMap(e => e.participants)
    .filter(p => p.userId === userId && p.isIncluded)
    .reduce((sum, p) => sum + p.amountOwed, 0);

  return { owedToYou, owedByYou, totalSpend, net: owedToYou - owedByYou };
}
```

This gives you exactly the GPay/Splitwise home-screen numbers:
- **You are owed ₹X** (green)
- **You owe ₹X** (red)
- **Total spend** (your lifetime share of group expenses)

---

## 5. End-to-end flow

1. User enters `totalAmount` + `reason` (note/description).
2. Picks group or contacts → default: everyone selected.
3. Picks `splitType`:
   - `EQUAL` → deselect anyone who's excluded → run `splitEqually()`.
   - `AMOUNT` → manually enter each person's amount → run `splitByAmount()`, block submit until `diff === 0`.
4. On submit:
   - Persist `Expense` + `ExpenseParticipant[]`.
   - Call `applyExpenseToLedger()` to update the pairwise `Balance` table.
   - Push a notification/event to each included participant (payload: `expenseId`, `reason`, `amountOwed`, `paidBy`).
5. Each participant's app re-fetches (or receives via socket/push) their updated `getUserSummary()` — this is what drives their "owed by you / owed to you / total spend" widgets.

---

## 6. Optional next step: Debt simplification

If a group has many crisscrossing expenses, you'll end up with messy pairwise
debts (A owes B, B owes C, C owes A). Splitwise runs a "simplify debts" pass
so people settle with fewer transactions — worth adding later:

```js
function simplifyDebts(ledger, memberIds) {
  // 1. Compute each member's single net position (positive = net creditor)
  const net = {};
  for (const id of memberIds) {
    net[id] = 0;
    for (const [other, amt] of (ledger.get(id) || new Map())) {
      net[id] += amt;
    }
  }

  // 2. Greedily match biggest creditor with biggest debtor
  const creditors = memberIds.filter(id => net[id] > 0).sort((a,b) => net[b]-net[a]);
  const debtors   = memberIds.filter(id => net[id] < 0).sort((a,b) => net[a]-net[b]);

  const transactions = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const c = creditors[i], d = debtors[j];
    const amount = Math.min(net[c], -net[d]);

    transactions.push({ from: d, to: c, amount });

    net[c] -= amount;
    net[d] += amount;
    if (net[c] === 0) i++;
    if (net[d] === 0) j++;
  }
  return transactions; // minimal set of payments to settle the whole group
}
```

This doesn't change who-owes-what in total — it just reduces the *number*
of payments needed to zero everything out.
