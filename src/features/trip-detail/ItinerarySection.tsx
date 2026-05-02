import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import type { DayWithPlaces } from "../../app/tripDetailData";
import { DayCard } from "./DayCard";
import {
  EMPTY_INSERT_DAY_FORM,
  EMPTY_PLACE_FORM,
  type DayFormValues,
  type InsertDayFormValues,
  type PlaceFormValues
} from "./types";

type ItinerarySectionProps = {
  daysWithPlaces: DayWithPlaces[];
  dayForm: DayFormValues;
  dayFormError?: string;
  collapsedDayIds: Record<string, boolean>;
  insertDayForms: Record<string, InsertDayFormValues>;
  placeForms: Record<string, PlaceFormValues>;
  editingPlaceId?: string;
  editPlaceForms: Record<string, PlaceFormValues>;
  onAddDay: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onCollapseDays: (dayIds: string[]) => void;
  onExpandAllDays: () => void;
  onDayFormChange: (patch: Partial<DayFormValues>) => void;
  onDeleteDay: (dayId: string) => Promise<void>;
  onInsertDayAfter: (
    event: FormEvent<HTMLFormElement>,
    afterDayId: string
  ) => Promise<void>;
  onInsertDayFormChange: (
    afterDayId: string,
    patch: Partial<InsertDayFormValues>
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
  onToggleDayCollapsed: (dayId: string) => void;
};

export function ItinerarySection({
  daysWithPlaces,
  dayForm,
  dayFormError,
  collapsedDayIds,
  insertDayForms,
  placeForms,
  editingPlaceId,
  editPlaceForms,
  onAddDay,
  onDayFormChange,
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
  onCollapseDays,
  onExpandAllDays,
  onToggleDayCollapsed
}: ItinerarySectionProps) {
  const { t } = useTranslation();
  const allDaysCollapsed =
    daysWithPlaces.length > 0 &&
    daysWithPlaces.every(({ day }) => collapsedDayIds[day.id]);

  const toggleAllDaysCollapsed = () => {
    if (allDaysCollapsed) {
      onExpandAllDays();
      return;
    }

    onCollapseDays(daysWithPlaces.map(({ day }) => day.id));
  };

  return (
    <section className="data-section">
      <div className="section-title-row">
        <h2>{t("tripDetail.sections.itinerary")}</h2>
        {daysWithPlaces.length > 0 ? (
          <button
            className="secondary-action"
            onClick={toggleAllDaysCollapsed}
            type="button"
          >
            {allDaysCollapsed
              ? t("tripDetail.expandAllDays")
              : t("tripDetail.collapseAllDays")}
          </button>
        ) : null}
      </div>
      <form className="compact-form" onSubmit={(event) => void onAddDay(event)}>
        <label>
          <span>{t("tripDetail.dayForm.date")}</span>
          <input
            onChange={(event) => onDayFormChange({ date: event.target.value })}
            required
            type="date"
            value={dayForm.date}
          />
        </label>
        <label>
          <span>{t("tripDetail.dayForm.city")}</span>
          <input
            onChange={(event) => onDayFormChange({ city: event.target.value })}
            required
            type="text"
            value={dayForm.city}
          />
        </label>
        <label>
          <span>{t("tripDetail.dayForm.summary")}</span>
          <input
            onChange={(event) =>
              onDayFormChange({ summary: event.target.value })
            }
            type="text"
            value={dayForm.summary}
          />
        </label>
        <button className="secondary-action" type="submit">
          {t("tripDetail.dayForm.submit")}
        </button>
      </form>
      {dayFormError ? <p className="status-message">{dayFormError}</p> : null}
      {daysWithPlaces.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyDays")}</p>
      ) : (
        <div className="timeline-list">
          {daysWithPlaces.map((dayWithPlaces, dayIndex) => (
            <DayCard
              canMoveDown={dayIndex < daysWithPlaces.length - 1}
              canMoveUp={dayIndex > 0}
              dayWithPlaces={dayWithPlaces}
              editPlaceForms={editPlaceForms}
              editingPlaceId={editingPlaceId}
              insertDayForm={
                insertDayForms[dayWithPlaces.day.id] ?? EMPTY_INSERT_DAY_FORM
              }
              isCollapsed={Boolean(collapsedDayIds[dayWithPlaces.day.id])}
              key={dayWithPlaces.day.id}
              onAddPlace={onAddPlace}
              onCancelEditingPlace={onCancelEditingPlace}
              onDeleteDay={onDeleteDay}
              onDeletePlace={onDeletePlace}
              onEditPlace={onEditPlace}
              onEditPlaceFormChange={onEditPlaceFormChange}
              onInsertDayAfter={onInsertDayAfter}
              onInsertDayFormChange={onInsertDayFormChange}
              onMoveDay={onMoveDay}
              onMovePlace={onMovePlace}
              onPlaceFormChange={onPlaceFormChange}
              onStartEditingPlace={onStartEditingPlace}
              onToggleCollapsed={onToggleDayCollapsed}
              placeForm={placeForms[dayWithPlaces.day.id] ?? EMPTY_PLACE_FORM}
            />
          ))}
        </div>
      )}
    </section>
  );
}
