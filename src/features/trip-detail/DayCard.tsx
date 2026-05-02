import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import { formatDate } from "../../shared/format";
import type { DayWithPlaces } from "../../app/tripDetailData";
import { PlaceCard } from "./PlaceCard";
import {
  type DayFormValues,
  type InsertDayFormValues,
  type PlaceFormValues
} from "./types";

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

  return (
    <article>
      <div className="item-heading-row">
        <div className="day-heading-copy">
          <span>{formatDate(day.date, i18n.language)}</span>
          <strong>{day.city}</strong>
        </div>
        <div className="day-heading-actions">
          <label className="collapse-toggle">
            <input
              checked={isCollapsed}
              onChange={() => onToggleCollapsed(day.id)}
              type="checkbox"
            />
            <span>{t("tripDetail.collapseDay")}</span>
          </label>
          <div className="reorder-actions">
            <button
              className="secondary-action"
              disabled={!canMoveUp}
              onClick={() => void onMoveDay(day.id, -1)}
              type="button"
            >
              {t("common.up")}
            </button>
            <button
              className="secondary-action"
              disabled={!canMoveDown}
              onClick={() => void onMoveDay(day.id, 1)}
              type="button"
            >
              {t("common.down")}
            </button>
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
          <form
            className="compact-form day-place-form"
            onSubmit={(event) => void onAddPlace(event, day.id)}
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
                  onPlaceFormChange(day.id, { addressZh: event.target.value })
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
          <form
            className="compact-form embedded-form"
            onSubmit={(event) => void onInsertDayAfter(event, day.id)}
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
          <button
            className="danger-action"
            onClick={() => void onDeleteDay(day.id)}
            type="button"
          >
            {t("common.delete")}
          </button>
        </>
      ) : null}
    </article>
  );
}
