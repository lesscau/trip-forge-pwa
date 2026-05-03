import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import {
  getPlaceCategoryLabelKey,
  placeCategories
} from "../places/placeCategories";
import { formatDate } from "../../shared/format";
import type { DayWithPlaces } from "../../app/tripDetailData";
import { PlaceCard } from "./PlaceCard";
import {
  type DayFormValues,
  type InsertDayFormValues,
  type PlaceFormValues
} from "./types";
import { IconButton } from "../../shared/IconButton";

type DayCardProps = {
  dayWithPlaces: DayWithPlaces;
  isCollapsed: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  placeForm: PlaceFormValues;
  insertDayForm: InsertDayFormValues;
  editingPlaceId?: string;
  editPlaceForms: Record<string, PlaceFormValues>;
  onDeleteDay: (dayId: string) => Promise<void>;
  onInsertDayAfter: (
    event: FormEvent<HTMLFormElement>,
    afterDayId: string
  ) => Promise<void>;
  onInsertDayFormChange: (
    afterDayId: string,
    patch: Partial<Omit<DayFormValues, "date">>
  ) => void;
  onMoveDay: (dayId: string, offset: -1 | 1) => Promise<void>;
  onAddPlace: (
    event: FormEvent<HTMLFormElement>,
    dayId: string
  ) => Promise<void>;
  onPlaceFormChange: (dayId: string, patch: Partial<PlaceFormValues>) => void;
  onDeletePlace: (placeId: string) => Promise<void>;
  onMovePlace: (placeId: string, offset: -1 | 1) => Promise<void>;
  onStartEditingPlace: (place: Place) => void;
  onEditPlaceFormChange: (
    placeId: string,
    patch: Partial<PlaceFormValues>
  ) => void;
  onEditPlace: (
    event: FormEvent<HTMLFormElement>,
    place: Place
  ) => Promise<void>;
  onCancelEditingPlace: () => void;
  onToggleCollapsed: (dayId: string) => void;
};

export function DayCard({
  dayWithPlaces,
  isCollapsed,
  canMoveUp,
  canMoveDown,
  placeForm,
  insertDayForm,
  editingPlaceId,
  editPlaceForms,
  onDeleteDay,
  onInsertDayAfter,
  onInsertDayFormChange,
  onMoveDay,
  onAddPlace,
  onPlaceFormChange,
  onDeletePlace,
  onMovePlace,
  onStartEditingPlace,
  onEditPlaceFormChange,
  onEditPlace,
  onCancelEditingPlace,
  onToggleCollapsed
}: DayCardProps) {
  const { i18n, t } = useTranslation();
  const { day, places: dayPlaces } = dayWithPlaces;
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [isInsertDayOpen, setIsInsertDayOpen] = useState(false);

  const handleAddPlace = async (event: FormEvent<HTMLFormElement>) => {
    await onAddPlace(event, day.id);
  };

  const handleInsertDayAfter = async (event: FormEvent<HTMLFormElement>) => {
    await onInsertDayAfter(event, day.id);
  };

  return (
    <article>
      <div className="item-heading-row">
        <div className="day-heading-copy">
          <span>{formatDate(day.date, i18n.language)}</span>
          <strong>{day.city}</strong>
        </div>
        <div className="day-heading-actions">
          <IconButton
            aria-expanded={!isCollapsed}
            icon={isCollapsed ? "chevronDown" : "chevronUp"}
            label={t(
              isCollapsed ? "tripDetail.expandDay" : "tripDetail.collapseDay"
            )}
            onClick={() => onToggleCollapsed(day.id)}
            type="button"
          />
          <div className="reorder-actions">
            <IconButton
              disabled={!canMoveUp}
              icon="arrowUp"
              label={t("common.up")}
              onClick={() => void onMoveDay(day.id, -1)}
              type="button"
            />
            <IconButton
              disabled={!canMoveDown}
              icon="arrowDown"
              label={t("common.down")}
              onClick={() => void onMoveDay(day.id, 1)}
              type="button"
            />
          </div>
        </div>
      </div>
      {!isCollapsed && day.summary ? <p>{day.summary}</p> : null}
      {!isCollapsed ? (
        <>
          {dayPlaces.length > 0 ? (
            <div className="day-place-list">
              {dayPlaces.map((place, placeIndex) => (
                <PlaceCard
                  canMoveDown={placeIndex < dayPlaces.length - 1}
                  canMoveUp={placeIndex > 0}
                  editPlaceForm={editPlaceForms[place.id]}
                  isEditing={editingPlaceId === place.id}
                  key={place.id}
                  onCancelEditing={onCancelEditingPlace}
                  onDelete={onDeletePlace}
                  onEdit={onEditPlace}
                  onEditFormChange={onEditPlaceFormChange}
                  onMovePlace={onMovePlace}
                  onStartEditing={onStartEditingPlace}
                  place={place}
                />
              ))}
            </div>
          ) : (
            <p className="muted-text">{t("tripDetail.emptyDayPlaces")}</p>
          )}
          <div className="day-card-footer-actions">
            <button
              aria-expanded={isAddPlaceOpen}
              className="secondary-action disclosure-button"
              onClick={() => setIsAddPlaceOpen((value) => !value)}
              type="button"
            >
              <span>{t("tripDetail.placeForm.submit")}</span>
              <span aria-hidden="true">{isAddPlaceOpen ? "^" : "v"}</span>
            </button>
            <button
              aria-expanded={isInsertDayOpen}
              className="secondary-action disclosure-button"
              onClick={() => setIsInsertDayOpen((value) => !value)}
              type="button"
            >
              <span>{t("tripDetail.insertDayForm.submit")}</span>
              <span aria-hidden="true">{isInsertDayOpen ? "^" : "v"}</span>
            </button>
            <IconButton
              icon="trash"
              label={t("common.delete")}
              onClick={() => void onDeleteDay(day.id)}
              type="button"
              variant="danger"
            />
          </div>
          {isAddPlaceOpen ? (
            <form
              className="compact-form day-place-form"
              onSubmit={(event) => void handleAddPlace(event)}
            >
              <label>
                <span>{t("tripDetail.placeForm.name")}</span>
                <input
                  onChange={(event) =>
                    onPlaceFormChange(day.id, { name: event.target.value })
                  }
                  required
                  type="text"
                  value={placeForm.name}
                />
              </label>
              <label>
                <span>{t("tripDetail.placeForm.category")}</span>
                <select
                  onChange={(event) =>
                    onPlaceFormChange(day.id, {
                      category: event.target
                        .value as PlaceFormValues["category"]
                    })
                  }
                  value={placeForm.category}
                >
                  {placeCategories.map((category) => (
                    <option key={category} value={category}>
                      {t(getPlaceCategoryLabelKey(category))}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t("tripDetail.placeForm.nameZh")}</span>
                <input
                  onChange={(event) =>
                    onPlaceFormChange(day.id, { nameZh: event.target.value })
                  }
                  type="text"
                  value={placeForm.nameZh}
                />
              </label>
              <label>
                <span>{t("tripDetail.placeForm.address")}</span>
                <input
                  onChange={(event) =>
                    onPlaceFormChange(day.id, { address: event.target.value })
                  }
                  type="text"
                  value={placeForm.address}
                />
              </label>
              <label>
                <span>{t("tripDetail.placeForm.addressZh")}</span>
                <input
                  onChange={(event) =>
                    onPlaceFormChange(day.id, {
                      addressZh: event.target.value
                    })
                  }
                  type="text"
                  value={placeForm.addressZh}
                />
              </label>
              <label>
                <span>{t("tripDetail.placeForm.notes")}</span>
                <input
                  onChange={(event) =>
                    onPlaceFormChange(day.id, { notes: event.target.value })
                  }
                  type="text"
                  value={placeForm.notes}
                />
              </label>
              <button className="secondary-action" type="submit">
                {t("tripDetail.placeForm.submit")}
              </button>
            </form>
          ) : null}
          {isInsertDayOpen ? (
            <form
              className="compact-form embedded-form"
              onSubmit={(event) => void handleInsertDayAfter(event)}
            >
              <label>
                <span>{t("tripDetail.insertDayForm.city")}</span>
                <input
                  onChange={(event) =>
                    onInsertDayFormChange(day.id, { city: event.target.value })
                  }
                  required
                  type="text"
                  value={insertDayForm.city}
                />
              </label>
              <label>
                <span>{t("tripDetail.insertDayForm.summary")}</span>
                <input
                  onChange={(event) =>
                    onInsertDayFormChange(day.id, {
                      summary: event.target.value
                    })
                  }
                  type="text"
                  value={insertDayForm.summary}
                />
              </label>
              <button className="secondary-action" type="submit">
                {t("tripDetail.insertDayForm.submit")}
              </button>
            </form>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
