import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Expense, TripDay } from "../../db/database";
import {
  getExpenseTotalsByCategory,
  getExpenseTotalsByCurrency
} from "./expenseTotals";
import { IconButton } from "../../shared/IconButton";
import type { ExpenseFormValues } from "./types";

type ExpensesSectionProps = {
  days: TripDay[];
  expenses: Expense[];
  expenseForm: ExpenseFormValues;
  editingExpenseId?: string;
  editExpenseForms: Record<string, ExpenseFormValues>;
  onExpenseFormChange: (patch: Partial<ExpenseFormValues>) => void;
  onAddExpense: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
  onStartEditingExpense: (expense: Expense) => void;
  onEditExpenseFormChange: (
    expenseId: string,
    patch: Partial<ExpenseFormValues>
  ) => void;
  onEditExpense: (
    event: FormEvent<HTMLFormElement>,
    expense: Expense
  ) => Promise<void>;
  onCancelEditingExpense: () => void;
};

export function ExpensesSection({
  days,
  expenses,
  expenseForm,
  editingExpenseId,
  editExpenseForms,
  onExpenseFormChange,
  onAddExpense,
  onDeleteExpense,
  onStartEditingExpense,
  onEditExpenseFormChange,
  onEditExpense,
  onCancelEditingExpense
}: ExpensesSectionProps) {
  const { t } = useTranslation();
  const totalsByCurrency = getExpenseTotalsByCurrency(expenses);
  const totalsByCategory = getExpenseTotalsByCategory(expenses);

  return (
    <section className="data-section">
      <h2>{t("tripDetail.sections.expenses")}</h2>
      <form
        className="compact-form"
        onSubmit={(event) => void onAddExpense(event)}
      >
        <label>
          <span>{t("tripDetail.expenseForm.title")}</span>
          <input
            onChange={(event) => onExpenseFormChange({ title: event.target.value })}
            required
            type="text"
            value={expenseForm.title}
          />
        </label>
        <label>
          <span>{t("tripDetail.expenseForm.amount")}</span>
          <input
            min="0.01"
            onChange={(event) => onExpenseFormChange({ amount: event.target.value })}
            required
            step="0.01"
            type="number"
            value={expenseForm.amount}
          />
        </label>
        <label>
          <span>{t("tripDetail.expenseForm.currency")}</span>
          <input
            onChange={(event) =>
              onExpenseFormChange({ currency: event.target.value })
            }
            required
            type="text"
            value={expenseForm.currency}
          />
        </label>
        <label>
          <span>{t("tripDetail.expenseForm.category")}</span>
          <input
            onChange={(event) =>
              onExpenseFormChange({ category: event.target.value })
            }
            required
            type="text"
            value={expenseForm.category}
          />
        </label>
        <label>
          <span>{t("tripDetail.expenseForm.paidBy")}</span>
          <input
            onChange={(event) => onExpenseFormChange({ paidBy: event.target.value })}
            type="text"
            value={expenseForm.paidBy}
          />
        </label>
        <label>
          <span>{t("tripDetail.expenseForm.dayId")}</span>
          <select
            onChange={(event) => onExpenseFormChange({ dayId: event.target.value })}
            value={expenseForm.dayId}
          >
            <option value="">{t("tripDetail.expenseForm.noDay")}</option>
            {days.map((day) => (
              <option key={day.id} value={day.id}>
                {day.date} · {day.city}
              </option>
            ))}
          </select>
        </label>
        <button className="secondary-action" type="submit">
          {t("tripDetail.expenseForm.submit")}
        </button>
      </form>

      {expenses.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyExpenses")}</p>
      ) : (
        <>
          <div className="summary-grid">
            <TotalsCard
              title={t("tripDetail.expenseTotals.byCurrency")}
              totals={totalsByCurrency}
            />
            <TotalsCard
              title={t("tripDetail.expenseTotals.byCategory")}
              totals={totalsByCategory}
            />
          </div>
          <div className="card-grid">
            {expenses.map((expense) => (
              <article className="focus-card" key={expense.id}>
                {editingExpenseId === expense.id ? (
                  <ExpenseForm
                    days={days}
                    expenseForm={editExpenseForms[expense.id]}
                    onCancel={onCancelEditingExpense}
                    onExpenseFormChange={(patch) =>
                      onEditExpenseFormChange(expense.id, patch)
                    }
                    onSubmit={(event) => void onEditExpense(event, expense)}
                    submitLabel={t("common.save")}
                  />
                ) : (
                  <>
                    <span>{expense.category}</span>
                    <strong>{expense.title}</strong>
                    <p>
                      {expense.amount.toLocaleString()} {expense.currency}
                    </p>
                    {expense.paidBy ? (
                      <p>
                        {t("tripDetail.expenseForm.paidBy")}: {expense.paidBy}
                      </p>
                    ) : null}
                    <div className="icon-button-row">
                      <IconButton
                        icon="edit"
                        label={t("common.edit")}
                        onClick={() => onStartEditingExpense(expense)}
                        type="button"
                      />
                      <IconButton
                        icon="trash"
                        label={t("common.delete")}
                        onClick={() => void onDeleteExpense(expense.id)}
                        type="button"
                        variant="danger"
                      />
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ExpenseForm({
  days,
  expenseForm,
  onExpenseFormChange,
  onSubmit,
  submitLabel,
  onCancel
}: {
  days: TripDay[];
  expenseForm: ExpenseFormValues;
  onExpenseFormChange: (patch: Partial<ExpenseFormValues>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <form className="compact-form embedded-form" onSubmit={onSubmit}>
      <label>
        <span>{t("tripDetail.expenseForm.title")}</span>
        <input
          onChange={(event) => onExpenseFormChange({ title: event.target.value })}
          required
          type="text"
          value={expenseForm.title}
        />
      </label>
      <label>
        <span>{t("tripDetail.expenseForm.amount")}</span>
        <input
          min="0.01"
          onChange={(event) => onExpenseFormChange({ amount: event.target.value })}
          required
          step="0.01"
          type="number"
          value={expenseForm.amount}
        />
      </label>
      <label>
        <span>{t("tripDetail.expenseForm.currency")}</span>
        <input
          onChange={(event) => onExpenseFormChange({ currency: event.target.value })}
          required
          type="text"
          value={expenseForm.currency}
        />
      </label>
      <label>
        <span>{t("tripDetail.expenseForm.category")}</span>
        <input
          onChange={(event) => onExpenseFormChange({ category: event.target.value })}
          required
          type="text"
          value={expenseForm.category}
        />
      </label>
      <label>
        <span>{t("tripDetail.expenseForm.paidBy")}</span>
        <input
          onChange={(event) => onExpenseFormChange({ paidBy: event.target.value })}
          type="text"
          value={expenseForm.paidBy}
        />
      </label>
      <label>
        <span>{t("tripDetail.expenseForm.dayId")}</span>
        <select
          onChange={(event) => onExpenseFormChange({ dayId: event.target.value })}
          value={expenseForm.dayId}
        >
          <option value="">{t("tripDetail.expenseForm.noDay")}</option>
          {days.map((day) => (
            <option key={day.id} value={day.id}>
              {day.date} · {day.city}
            </option>
          ))}
        </select>
      </label>
      <div className="button-row">
        <button className="secondary-action" type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="secondary-action" onClick={onCancel} type="button">
            {t("common.cancel")}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function TotalsCard({
  title,
  totals
}: {
  title: string;
  totals: { key: string; amount: number }[];
}) {
  return (
    <article className="focus-card">
      <strong>{title}</strong>
      <dl className="totals-list">
        {totals.map((total) => (
          <div key={total.key}>
            <dt>{total.key}</dt>
            <dd>{total.amount.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
