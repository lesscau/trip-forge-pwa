import {
  useCallback,
  useEffect,
  useState,
  type FormEvent
} from "react";
import { useTranslation } from "react-i18next";

import type { ChecklistItem, Place, TripDay } from "../../db/database";
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
import { insertDayAfter, moveDayByOffset, movePlaceByOffset } from "../../app/itineraryOrdering";
import { groupPlacesByDay } from "../../app/tripDetailData";
import { normalizePlaceCategory } from "../places/placeCategories";
import { isDateWithinRange } from "../../shared/dateValidation";
import { getNextOrderIndex } from "../../shared/ordering";
import {
  EMPTY_CHECKLIST_FORM,
  EMPTY_DAY_FORM,
  EMPTY_INSERT_DAY_FORM,
  EMPTY_PLACE_FORM,
  getLastDayDate,
  type ChecklistFormValues,
  type DayFormValues,
  type InsertDayFormValues,
  type PlaceFormValues,
  type TripDetailSectionData
} from "./types";

export function useTripDetailData(tripId?: string) {
  const { t } = useTranslation();
  const [data, setData] = useState<TripDetailSectionData>({
    daysWithPlaces: [],
    places: [],
    bookings: [],
    checklistItems: [],
    isLoading: true
  });
  const [dayForm, setDayForm] = useState<DayFormValues>(EMPTY_DAY_FORM);
  const [insertDayForms, setInsertDayForms] = useState<
    Record<string, InsertDayFormValues>
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
      setData((current) => ({
        ...current,
        errorMessage: t("tripDetail.missingTripId"),
        isLoading: false
      }));
      return;
    }

    setData((current) => ({
      ...current,
      errorMessage: undefined,
      isLoading: true
    }));

    try {
      const loadedTrip = await getTrip(tripId);

      if (!loadedTrip) {
        setData({
          trip: undefined,
          daysWithPlaces: [],
          places: [],
          bookings: [],
          checklistItems: [],
          isLoading: false
        });
        return;
      }

      const [loadedDays, loadedPlaces, loadedBookings, loadedChecklistItems] =
        await Promise.all([
          listDaysByTrip(tripId),
          listPlacesByTrip(tripId),
          listBookingsByTrip(tripId),
          listChecklistItemsByTrip(tripId)
        ]);

      setData({
        trip: loadedTrip,
        daysWithPlaces: groupPlacesByDay(loadedDays, loadedPlaces),
        places: loadedPlaces,
        bookings: loadedBookings,
        checklistItems: loadedChecklistItems,
        isLoading: false
      });
    } catch (error) {
      setData((current) => ({
        ...current,
        errorMessage:
          error instanceof Error ? error.message : t("tripDetail.loadError"),
        isLoading: false
      }));
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

    if (!data.trip) {
      return;
    }

    const city = dayForm.city.trim();
    const summary = dayForm.summary.trim();

    if (!city) {
      return;
    }

    if (!isDateWithinRange(dayForm.date, data.trip.startDate, data.trip.endDate)) {
      setDayFormError(t("tripDetail.dayForm.dateOutOfRange"));
      return;
    }

    await upsertDay({
      id: crypto.randomUUID(),
      tripId: data.trip.id,
      date: dayForm.date,
      city,
      summary: summary || undefined,
      orderIndex: getNextOrderIndex(data.daysWithPlaces.map(({ day }) => day))
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
    patch: Partial<InsertDayFormValues>
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
    if (!data.trip) {
      return;
    }

    const lastDayDate = getLastDayDate(nextDays);

    await Promise.all(nextDays.map((day) => upsertDay(day)));

    if (lastDayDate && lastDayDate > data.trip.endDate) {
      await updateTrip(data.trip.id, { endDate: lastDayDate });
    }

    await loadTrip();
  };

  const handleInsertDayAfter = async (
    event: FormEvent<HTMLFormElement>,
    afterDayId: string
  ) => {
    event.preventDefault();

    if (!data.trip) {
      return;
    }

    const insertForm = insertDayForms[afterDayId] ?? EMPTY_INSERT_DAY_FORM;
    const city = insertForm.city.trim();
    const summary = insertForm.summary.trim();

    if (!city) {
      return;
    }

    const nextDays = insertDayAfter(
      data.daysWithPlaces.map(({ day }) => day),
      {
        id: crypto.randomUUID(),
        tripId: data.trip.id,
        date: data.trip.startDate,
        city,
        summary: summary || undefined,
        orderIndex: 0
      },
      afterDayId,
      data.trip.startDate
    );

    setInsertDayForms((current) => ({
      ...current,
      [afterDayId]: { city: "", summary: "" }
    }));
    await persistReorderedDays(nextDays);
  };

  const handleMoveDay = async (dayId: string, offset: -1 | 1) => {
    if (!data.trip) {
      return;
    }

    const nextDays = moveDayByOffset(
      data.daysWithPlaces.map(({ day }) => day),
      dayId,
      offset,
      data.trip.startDate
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

    if (!data.trip) {
      return;
    }

    const placeForm = placeForms[dayId] ?? EMPTY_PLACE_FORM;
    const name = placeForm.name.trim();

    if (!name) {
      return;
    }

    await upsertPlace({
      id: crypto.randomUUID(),
      tripId: data.trip.id,
      dayId,
      name,
      category: normalizePlaceCategory(placeForm.category),
      nameZh: placeForm.nameZh.trim() || undefined,
      address: placeForm.address.trim() || undefined,
      addressZh: placeForm.addressZh.trim() || undefined,
      notes: placeForm.notes.trim() || undefined,
      orderIndex: getNextOrderIndex(data.places)
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
    const nextPlaces = movePlaceByOffset(data.places, placeId, offset);
    await Promise.all(nextPlaces.map((place) => upsertPlace(place)));
    await loadTrip();
  };

  const startEditingPlace = (place: Place) => {
    setEditingPlaceId(place.id);
    setEditPlaceForms((current) => ({
      ...current,
      [place.id]: {
        name: place.name,
        category: place.category ?? "other",
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
      category: place.category ?? "other",
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
      category: normalizePlaceCategory(placeForm.category),
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
    setData((current) => ({
      ...current,
      checklistItems: current.checklistItems.map((currentItem) =>
        currentItem.id === item.id ? updatedItem : currentItem
      )
    }));
  };

  const handleAddChecklistItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.trip) {
      return;
    }

    const title = checklistForm.title.trim();

    if (!title) {
      return;
    }

    await upsertChecklistItem({
      id: crypto.randomUUID(),
      tripId: data.trip.id,
      title,
      category: checklistForm.category.trim() || undefined,
      completed: false,
      orderIndex: getNextOrderIndex(data.checklistItems)
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

  return {
    ...data,
    dayForm,
    dayFormError,
    insertDayForms,
    placeForms,
    editingPlaceId,
    editPlaceForms,
    checklistForm,
    collapsedDayIds,
    updateDayForm,
    handleAddDay,
    handleDeleteDay,
    toggleDayCollapsed,
    collapseDays,
    expandAllDays,
    updateInsertDayForm,
    handleInsertDayAfter,
    handleMoveDay,
    updatePlaceForm,
    handleAddPlace,
    handleDeletePlace,
    handleMovePlace,
    startEditingPlace,
    updateEditPlaceForm,
    cancelEditingPlace,
    handleEditPlace,
    setChecklistForm,
    handleToggleChecklistItem,
    handleAddChecklistItem,
    handleDeleteChecklistItem
  };
}
