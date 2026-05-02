import type { Expense } from "../../db/database";

export type ExpenseTotal = {
  key: string;
  amount: number;
};

export function getExpenseTotalsByCurrency(expenses: Expense[]): ExpenseTotal[] {
  return getExpenseTotals(expenses, (expense) => expense.currency);
}

export function getExpenseTotalsByCategory(expenses: Expense[]): ExpenseTotal[] {
  return getExpenseTotals(expenses, (expense) => expense.category);
}

function getExpenseTotals(
  expenses: Expense[],
  getKey: (expense: Expense) => string
): ExpenseTotal[] {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    const key = getKey(expense).trim() || "other";
    totals.set(key, (totals.get(key) ?? 0) + expense.amount);
  }

  return Array.from(totals, ([key, amount]) => ({ key, amount })).sort(
    (left, right) => left.key.localeCompare(right.key)
  );
}
