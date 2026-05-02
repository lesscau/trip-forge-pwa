import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { ChecklistItem } from "../../db/database";
import type { ChecklistFormValues } from "./types";

type ChecklistSectionProps = {
  checklistItems: ChecklistItem[];
  checklistForm: ChecklistFormValues;
  onChecklistFormChange: (patch: Partial<ChecklistFormValues>) => void;
  onAddChecklistItem: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onToggleChecklistItem: (item: ChecklistItem) => Promise<void>;
  onDeleteChecklistItem: (itemId: string) => Promise<void>;
};

export function ChecklistSection({
  checklistItems,
  checklistForm,
  onChecklistFormChange,
  onAddChecklistItem,
  onToggleChecklistItem,
  onDeleteChecklistItem
}: ChecklistSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="data-section">
      <h2>{t("tripDetail.sections.checklist")}</h2>
      <form
        className="compact-form"
        onSubmit={(event) => void onAddChecklistItem(event)}
      >
        <label>
          <span>{t("tripDetail.checklistForm.title")}</span>
          <input
            onChange={(event) =>
              onChecklistFormChange({ title: event.target.value })
            }
            required
            type="text"
            value={checklistForm.title}
          />
        </label>
        <label>
          <span>{t("tripDetail.checklistForm.category")}</span>
          <input
            onChange={(event) =>
              onChecklistFormChange({ category: event.target.value })
            }
            type="text"
            value={checklistForm.category}
          />
        </label>
        <button className="secondary-action" type="submit">
          {t("tripDetail.checklistForm.submit")}
        </button>
      </form>
      {checklistItems.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyChecklist")}</p>
      ) : (
        <div className="checklist-list">
          {checklistItems.map((item) => (
            <label className="checklist-row" key={item.id}>
              <input
                checked={item.completed}
                onChange={() => void onToggleChecklistItem(item)}
                type="checkbox"
              />
              <span>{item.title}</span>
              <button
                className="danger-action"
                onClick={() => void onDeleteChecklistItem(item.id)}
                type="button"
              >
                {t("common.delete")}
              </button>
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
