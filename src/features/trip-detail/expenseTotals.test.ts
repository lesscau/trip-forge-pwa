import { describe, expect, it } from "vitest";

import type { Expense } from "../../db/database";
import {
  getExpenseTotalsByCategory,
  getExpenseTotalsByCurrency
} from "./expenseTotals";

const expenses: Expense[] = [
  {
    id: "hotel",
    tripId: "trip",
    title: "Hotel",
    amount: 300,
    currency: "CNY",
    category: "lodging",
    createdAt: "2026-05-02T10:00:00.000Z"
  },
  {
    id: "train",
    tripId: "trip",
    title: "Train",
    amount: 120,
    currency: "CNY",
    category: "transport",
    createdAt: "2026-05-02T11:00:00.000Z"
  },
  {
    id: "museum",
    tripId: "trip",
    title: "Museum",
    amount: 40,
    currency: "USD",
    category: "tickets",
    createdAt: "2026-05-02T12:00:00.000Z"
  }
];

describe("expense totals", () => {
  it("groups totals by currency", () => {
    expect(getExpenseTotalsByCurrency(expenses)).toEqual([
      { key: "CNY", amount: 420 },
      { key: "USD", amount: 40 }
    ]);
  });

  it("groups totals by category", () => {
    expect(getExpenseTotalsByCategory(expenses)).toEqual([
      { key: "lodging", amount: 300 },
      { key: "tickets", amount: 40 },
      { key: "transport", amount: 120 }
    ]);
  });
});
