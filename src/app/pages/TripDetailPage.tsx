import {
  useCallback,
  useEffect,
  useState,
  type FormEvent
} from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type {
  Booking,
  ChecklistItem,
  Place,
  Trip,
  TripDay
} from "../../db/database";
import {
  deleteChecklistItem,
  deleteDay,
  deletePlace,
  getTrip,
  listBookingsByTrip,
  listChecklistItemsByTrip,
  listDaysByTrip,
  listPlacesByTrip,
  upsertChecklistItem,
  upsertDay,
  upsertPlace,
  updateTrip
} from "../../db/repositories";
import { isDateWithinRange } from "../../shared/dateValidation";
import { formatDate, formatTripDateRange } from "../../shared/format";
import { getNextOrderIndex } from "../../shared/ordering";
import {
  insertDayAfter,
  moveDayByOffset,
  movePlaceByOffset
} from "../itineraryOrdering";
import { groupPlacesByDay, type DayWithPlaces } from "../tripDetailData";

type DayFormValues = {
  date: string;
  city: string;
  summary: string;
};

type PlaceFormValues = {
  name: string;
  nameZh: string;
  address: string;
  addressZh: string;
  notes: string;
};

type ChecklistFormValues = {
  title: string;
  category: string;
};

const EMPTY_DAY_FORM: DayFormValues = {
  date: "",
  city: "",
  summary: ""
};

const EMPTY_INSERT_DAY_FORM: Omit<DayFormValues, "date"> = {
  city: "",
  summary: ""
};

const EMPTY_PLACE_FORM: PlaceFormValues = {
  name: "",
  nameZh: "",
  address: "",
  addressZh: "",
  notes: ""
};

const EMPTY_CHECKLIST_FORM: ChecklistFormValues = {
  title: "",
  category: ""
};

function getLastDayDate(days: TripDay[]): string | undefined {
  return [...days].sort((left, right) => right.orderIndex - left.orderIndex)[0]
    ?.date;
}

export function TripDetailPage() {
  const { tripId } = useParams();
  const { t } = useTranslation();
  const [trip, setTrip] = useState<Trip>();
  const [daysWithPlaces, setDaysWithPlaces] = useState<DayWithPlaces[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [dayForm, setDayForm] = useState<DayFormValues>(EMPTY_DAY_FORM);
  const [insertDayForms, setInsertDayForms] = useState<
    Record<string, Omit<DayFormValues, "date">>
  >({});
  const [dayFormError, setDayFormError] = useState<string>();
  const [placeForms, setPlaceForms] = useState<Record<string, PlaceFormValues>>(
    {}
  );
  const [editingPlaceId, setEditingPlaceId] = useState<string>();
  const [editPlaceForms, setEditPlaceForms] = useState<
    Record<string, PlaceFormValues>
  >({});
  const [checklistForm, setChecklistForm] =
    useState<ChecklistFormValues>(EMPTY_CHECKLIST_FORM);
  const [collapsedDayIds, setCollapsedDayIds] = useState<
    Record<string, boolean>
  >({});

  const loadTrip = useCallback(async () => {
    if (!tripId) {
      setErrorMessage(t("tripDetail.missingTripId"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const loadedTrip = await getTrip(tripId);

      if (!loadedTrip) {
        setTrip(undefined);
        return;
      }

      const [loadedDays, loadedPlaces, loadedBookings, loadedChecklistItems] =
        await Promise.all([
          listDaysByTrip(tripId),
          listPlacesByTrip(tripId),
          listBookingsByTrip(tripId),
          listChecklistItemsByTrip(tripId)
        ]);

      setTrip(loadedTrip);
      setDaysWithPlaces(groupPlacesByDay(loadedDays, loadedPlaces));
      setPlaces(loadedPlaces);
      setBookings(loadedBookings);
      setChecklistItems(loadedChecklistItems);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("tripDetail.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  }, [tripId, t]);

  useEffect(() => {
    void loadTrip();
  }, [loadTrip]);

  const updateDayForm = (patch: Partial<DayFormValues>) => {
    setDayForm((current) => ({ ...current, ...patch }));
    setDayFormError(undefined);
  };

  const handleAddDay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    const city = dayForm.city.trim();
    const summary = dayForm.summary.trim();

    if (!city) {
      return;
    }

    if (!isDateWithinRange(dayForm.date, trip.startDate, trip.endDate)) {
      setDayFormError(t("tripDetail.dayForm.dateOutOfRange"));
      return;
    }

    await upsertDay({
      id: crypto.randomUUID(),
      tripId: trip.id,
      date: dayForm.date,
      city,
      summary: summary || undefined,
      orderIndex: getNextOrderIndex(daysWithPlaces.map(({ day }) => day))
    });
    setDayForm(EMPTY_DAY_FORM);
    await loadTrip();
  };

  const handleDeleteDay = async (dayId: string) => {
    if (!window.confirm(t("tripDetail.confirmDeleteDay"))) {
      return;
    }

    await deleteDay(dayId);
    setCollapsedDayIds((current) => {
      const nextCollapsedDayIds = { ...current };

      delete nextCollapsedDayIds[dayId];

      return nextCollapsedDayIds;
    });
    await loadTrip();
  };

  const toggleDayCollapsed = (dayId: string) => {
    setCollapsedDayIds((current) => ({
      ...current,
      [dayId]: !current[dayId]
    }));
  };

  const collapseDays = (dayIds: string[]) => {
    setCollapsedDayIds(Object.fromEntries(dayIds.map((dayId) => [dayId, true])));
  };

  const expandAllDays = () => {
    setCollapsedDayIds({});
  };

  const updateInsertDayForm = (
    afterDayId: string,
    patch: Partial<Omit<DayFormValues, "date">>
  ) => {
    setInsertDayForms((current) => ({
      ...current,
      [afterDayId]: {
        ...EMPTY_INSERT_DAY_FORM,
        ...current[afterDayId],
        ...patch
      }
    }));
  };

  const persistReorderedDays = async (nextDays: TripDay[]) => {
    if (!trip) {
      return;
    }

    const lastDayDate = getLastDayDate(nextDays);

    await Promise.all(nextDays.map((day) => upsertDay(day)));

    if (lastDayDate && lastDayDate > trip.endDate) {
      await updateTrip(trip.id, { endDate: lastDayDate });
    }

    await loadTrip();
  };

  const handleInsertDayAfter = async (
    event: FormEvent<HTMLFormElement>,
    afterDayId: string
  ) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    const insertForm = insertDayForms[afterDayId] ?? EMPTY_INSERT_DAY_FORM;
    const city = insertForm.city.trim();
    const summary = insertForm.summary.trim();

    if (!city) {
      return;
    }

    const currentDays = daysWithPlaces.map(({ day }) => day);
    const nextDays = insertDayAfter(
      currentDays,
      {
        id: crypto.randomUUID(),
        tripId: trip.id,
        date: trip.startDate,
        city,
        summary: summary || undefined,
        orderIndex: 0
      },
      afterDayId,
      trip.startDate
    );

    setInsertDayForms((current) => ({
      ...current,
      [afterDayId]: { city: "", summary: "" }
    }));
    await persistReorderedDays(nextDays);
  };

  const handleMoveDay = async (dayId: string, offset: -1 | 1) => {
    if (!trip) {
      return;
    }

    const nextDays = moveDayByOffset(
      daysWithPlaces.map(({ day }) => day),
      dayId,
      offset,
      trip.startDate
    );

    await persistReorderedDays(nextDays);
  };

  const updatePlaceForm = (
    dayId: string,
    patch: Partial<PlaceFormValues>
  ) => {
    setPlaceForms((current) => ({
      ...current,
      [dayId]: {
        ...EMPTY_PLACE_FORM,
        ...current[dayId],
        ...patch
      }
    }));
  };

  const handleAddPlace = async (
    event: FormEvent<HTMLFormElement>,
    dayId: string
  ) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    const placeForm = placeForms[dayId] ?? EMPTY_PLACE_FORM;
    const name = placeForm.name.trim();

    if (!name) {
      return;
    }

    await upsertPlace({
      id: crypto.randomUUID(),
      tripId: trip.id,
      dayId,
      name,
      nameZh: placeForm.nameZh.trim() || undefined,
      address: placeForm.address.trim() || undefined,
      addressZh: placeForm.addressZh.trim() || undefined,
      notes: placeForm.notes.trim() || undefined,
      orderIndex: getNextOrderIndex(places)
    });
    setPlaceForms((current) => ({
      ...current,
      [dayId]: EMPTY_PLACE_FORM
    }));
    await loadTrip();
  };

  const handleDeletePlace = async (placeId: string) => {
    if (!window.confirm(t("tripDetail.confirmDeletePlace"))) {
      return;
    }

    await deletePlace(placeId);
    await loadTrip();
  };

  const handleMovePlace = async (placeId: string, offset: -1 | 1) => {
    const nextPlaces = movePlaceByOffset(places, placeId, offset);
    await Promise.all(nextPlaces.map((place) => upsertPlace(place)));
    await loadTrip();
  };

  const startEditingPlace = (place: Place) => {
    setEditingPlaceId(place.id);
    setEditPlaceForms((current) => ({
      ...current,
      [place.id]: {
        name: place.name,
        nameZh: place.nameZh ?? "",
        address: place.address ?? "",
        addressZh: place.addressZh ?? "",
        notes: place.notes ?? ""
      }
    }));
  };

  const updateEditPlaceForm = (
    placeId: string,
    patch: Partial<PlaceFormValues>
  ) => {
    setEditPlaceForms((current) => ({
      ...current,
      [placeId]: {
        ...EMPTY_PLACE_FORM,
        ...current[placeId],
        ...patch
      }
    }));
  };

  const cancelEditingPlace = () => {
    setEditingPlaceId(undefined);
  };

  const handleEditPlace = async (
    event: FormEvent<HTMLFormElement>,
    place: Place
  ) => {
    event.preventDefault();

    const placeForm = editPlaceForms[place.id] ?? {
      name: place.name,
      nameZh: place.nameZh ?? "",
      address: place.address ?? "",
      addressZh: place.addressZh ?? "",
      notes: place.notes ?? ""
    };
    const name = placeForm.name.trim();

    if (!name) {
      return;
    }

    await upsertPlace({
      ...place,
      name,
      nameZh: placeForm.nameZh.trim() || undefined,
      address: placeForm.address.trim() || undefined,
      addressZh: placeForm.addressZh.trim() || undefined,
      notes: placeForm.notes.trim() || undefined
    });
    setEditingPlaceId(undefined);
    await loadTrip();
  };

  const handleToggleChecklistItem = async (item: ChecklistItem) => {
    const updatedItem = {
      ...item,
      completed: !item.completed
    };

    await upsertChecklistItem(updatedItem);
    setChecklistItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id ? updatedItem : currentItem
      )
    );
  };

  const handleAddChecklistItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    const title = checklistForm.title.trim();

    if (!title) {
      return;
    }

    await upsertChecklistItem({
      id: crypto.randomUUID(),
      tripId: trip.id,
      title,
      category: checklistForm.category.trim() || undefined,
      completed: false,
      orderIndex: getNextOrderIndex(checklistItems)
    });
    setChecklistForm(EMPTY_CHECKLIST_FORM);
    await loadTrip();
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    if (!window.confirm(t("tripDetail.confirmDeleteChecklistItem"))) {
      return;
    }

    await deleteChecklistItem(itemId);
    await loadTrip();
  };

  if (isLoading) {
    return <p className="muted-text">{t("common.loading")}</p>;
  }

  if (errorMessage) {
    return <p className="status-message">{errorMessage}</p>;
  }

  if (!trip) {
    return (
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
          <h1>{t("tripDetail.notFoundTitle")}</h1>
          <p>{t("tripDetail.notFoundDescription")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <TripHeader trip={trip} />
      <ItinerarySection
        dayForm={dayForm}
        dayFormError={dayFormError}
        collapsedDayIds={collapsedDayIds}
        daysWithPlaces={daysWithPlaces}
        editPlaceForms={editPlaceForms}
        editingPlaceId={editingPlaceId}
        insertDayForms={insertDayForms}
        onAddDay={handleAddDay}
        onAddPlace={handleAddPlace}
        onCancelEditingPlace={cancelEditingPlace}
        onCollapseDays={collapseDays}
        onDayFormChange={updateDayForm}
        onDeleteDay={handleDeleteDay}
        onDeletePlace={handleDeletePlace}
        onEditPlace={handleEditPlace}
        onEditPlaceFormChange={updateEditPlaceForm}
        onExpandAllDays={expandAllDays}
        onInsertDayAfter={handleInsertDayAfter}
        onInsertDayFormChange={updateInsertDayForm}
        onMoveDay={handleMoveDay}
        onMovePlace={handleMovePlace}
        onPlaceFormChange={updatePlaceForm}
        onStartEditingPlace={startEditingPlace}
        onToggleDayCollapsed={toggleDayCollapsed}
        placeForms={placeForms}
      />
      <BookingsSection bookings={bookings} />
      <ChecklistSection
        checklistForm={checklistForm}
        checklistItems={checklistItems}
        onAddChecklistItem={handleAddChecklistItem}
        onChecklistFormChange={(patch) =>
          setChecklistForm((current) => ({ ...current, ...patch }))
        }
        onDeleteChecklistItem={handleDeleteChecklistItem}
        onToggleChecklistItem={handleToggleChecklistItem}
      />
    </section>
  );
}

function TripHeader({ trip }: { trip: Trip }) {
  const { i18n, t } = useTranslation();

  return (
    <div className="section-heading">
      <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
      <h1>{trip.title}</h1>
      <p>
        {trip.destinationCountry}{" - "}
        {formatTripDateRange(trip.startDate, trip.endDate, i18n.language)}
      </p>
    </div>
  );
}

type ItinerarySectionProps = {
  daysWithPlaces: DayWithPlaces[];
  dayForm: DayFormValues;
  dayFormError?: string;
  collapsedDayIds: Record<string, boolean>;
  insertDayForms: Record<string, Omit<DayFormValues, "date">>;
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
  onToggleDayCollapsed: (dayId: string) => void;
};

function ItinerarySection({
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
          {daysWithPlaces.map((dayWithPlaces) => (
            <DayCard
              dayWithPlaces={dayWithPlaces}
              isCollapsed={Boolean(collapsedDayIds[dayWithPlaces.day.id])}
              editPlaceForms={editPlaceForms}
              editingPlaceId={editingPlaceId}
              insertDayForm={
                insertDayForms[dayWithPlaces.day.id] ?? EMPTY_INSERT_DAY_FORM
              }
              key={dayWithPlaces.day.id}
              canMoveDown={daysWithPlaces.indexOf(dayWithPlaces) < daysWithPlaces.length - 1}
              canMoveUp={daysWithPlaces.indexOf(dayWithPlaces) > 0}
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

type DayCardProps = {
  dayWithPlaces: DayWithPlaces;
  isCollapsed: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  placeForm: PlaceFormValues;
  insertDayForm: Omit<DayFormValues, "date">;
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

function DayCard({
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
          {dayPlaces.map((place) => (
            <PlaceCard
              canMoveDown={dayPlaces.indexOf(place) < dayPlaces.length - 1}
              canMoveUp={dayPlaces.indexOf(place) > 0}
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
              onInsertDayFormChange(day.id, { summary: event.target.value })
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

type PlaceCardProps = {
  place: Place;
  isEditing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  editPlaceForm?: PlaceFormValues;
  onStartEditing: (place: Place) => void;
  onDelete: (placeId: string) => Promise<void>;
  onMovePlace: (placeId: string, offset: -1 | 1) => Promise<void>;
  onEditFormChange: (placeId: string, patch: Partial<PlaceFormValues>) => void;
  onEdit: (event: FormEvent<HTMLFormElement>, place: Place) => Promise<void>;
  onCancelEditing: () => void;
};

function PlaceCard({
  place,
  isEditing,
  canMoveUp,
  canMoveDown,
  editPlaceForm,
  onStartEditing,
  onDelete,
  onMovePlace,
  onEditFormChange,
  onEdit,
  onCancelEditing
}: PlaceCardProps) {
  const { t } = useTranslation();
  const formValues = editPlaceForm ?? {
    name: place.name,
    nameZh: place.nameZh ?? "",
    address: place.address ?? "",
    addressZh: place.addressZh ?? "",
    notes: place.notes ?? ""
  };

  return (
    <article className="day-place-card">
      {isEditing ? (
        <form
          className="compact-form embedded-form"
          onSubmit={(event) => void onEdit(event, place)}
        >
          <label>
            <span>{t("tripDetail.placeForm.name")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { name: event.target.value })
              }
              required
              type="text"
              value={formValues.name}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.nameZh")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { nameZh: event.target.value })
              }
              type="text"
              value={formValues.nameZh}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.address")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { address: event.target.value })
              }
              type="text"
              value={formValues.address}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.addressZh")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { addressZh: event.target.value })
              }
              type="text"
              value={formValues.addressZh}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.notes")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { notes: event.target.value })
              }
              type="text"
              value={formValues.notes}
            />
          </label>
          <div className="button-row">
            <button className="secondary-action" type="submit">
              {t("common.save")}
            </button>
            <button
              className="secondary-action"
              onClick={onCancelEditing}
              type="button"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="item-heading-row">
            <strong>{place.name}</strong>
            <div className="reorder-actions">
              <button
                className="secondary-action"
                disabled={!canMoveUp}
                onClick={() => void onMovePlace(place.id, -1)}
                type="button"
              >
                {t("common.up")}
              </button>
              <button
                className="secondary-action"
                disabled={!canMoveDown}
                onClick={() => void onMovePlace(place.id, 1)}
                type="button"
              >
                {t("common.down")}
              </button>
            </div>
          </div>
          {place.nameZh ? <span>{place.nameZh}</span> : null}
          {place.addressZh ? <p>{place.addressZh}</p> : null}
          {place.address ? <p>{place.address}</p> : null}
          {place.notes ? <p>{place.notes}</p> : null}
          <div className="button-row">
            <button
              className="secondary-action"
              onClick={() => onStartEditing(place)}
              type="button"
            >
              {t("common.edit")}
            </button>
            <button
              className="danger-action"
              onClick={() => void onDelete(place.id)}
              type="button"
            >
              {t("common.delete")}
            </button>
          </div>
        </>
      )}
    </article>
  );
}

function BookingsSection({ bookings }: { bookings: Booking[] }) {
  const { t } = useTranslation();

  return (
    <section className="data-section">
      <h2>{t("tripDetail.sections.bookings")}</h2>
      {bookings.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyBookings")}</p>
      ) : (
        <div className="card-grid">
          {bookings.map((booking) => (
            <article className="focus-card" key={booking.id}>
              <span>{t(`bookingTypes.${booking.type}`)}</span>
              <strong>{booking.title}</strong>
              {booking.confirmationCode ? (
                <p>
                  {t("tripDetail.confirmationCode")}:{" "}
                  {booking.confirmationCode}
                </p>
              ) : null}
              {booking.startsAt ? (
                <p>
                  {t("tripDetail.startsAt")}: {booking.startsAt}
                </p>
              ) : null}
              {booking.endsAt ? (
                <p>
                  {t("tripDetail.endsAt")}: {booking.endsAt}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

type ChecklistSectionProps = {
  checklistItems: ChecklistItem[];
  checklistForm: ChecklistFormValues;
  onChecklistFormChange: (patch: Partial<ChecklistFormValues>) => void;
  onAddChecklistItem: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onToggleChecklistItem: (item: ChecklistItem) => Promise<void>;
  onDeleteChecklistItem: (itemId: string) => Promise<void>;
};

function ChecklistSection({
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
