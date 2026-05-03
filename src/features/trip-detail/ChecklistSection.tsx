import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { ChecklistItem } from "../../db/database";
import { IconButton } from "../../shared/IconButton";
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
  const groupedItems = groupChecklistItems(checklistItems);

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
        <div className="places-group-list">
          {groupedItems.map((group) => (
            <section className="places-group" key={group.category}>
              <h3>
                {group.category === emptyCategory
                  ? t("tripDetail.checklistForm.noCategory")
                  : group.category}
              </h3>
              <div className="checklist-list">
                {group.items.map((item) => (
                  <label className="checklist-row" key={item.id}>
                    <input
                      checked={item.completed}
                      onChange={() => void onToggleChecklistItem(item)}
                      type="checkbox"
                    />
                    <span>{item.title}</span>
                    <IconButton
                      icon="trash"
                      label={t("common.delete")}
                      onClick={() => void onDeleteChecklistItem(item.id)}
                      type="button"
                      variant="danger"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

const emptyCategory = "__empty_category__";

function groupChecklistItems(checklistItems: ChecklistItem[]) {
  const groups = new Map<string, ChecklistItem[]>();

  for (const item of checklistItems) {
    const category = item.category?.trim() || emptyCategory;
    groups.set(category, [...(groups.get(category) ?? []), item]);
  }

  return Array.from(groups, ([category, items]) => ({
    category,
    items
  })).sort((left, right) => left.category.localeCompare(right.category));
}
