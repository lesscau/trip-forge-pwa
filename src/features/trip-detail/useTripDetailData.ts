import {
  useCallback,
  useEffect,
  useState,
  type FormEvent
} from "react";
import { useTranslation } from "react-i18next";

import type { Booking, ChecklistItem, Expense, Place, TripDay } from "../../db/database";
import {
  deleteBooking,
  deleteChecklistItem,
  deleteDay,
  deleteDocument,
  deleteExpense,
  deletePlace,
  getTrip,
  listBookingsByTrip,
  listChecklistItemsByTrip,
  listDaysByTrip,
  listDocumentsByTrip,
  listExpensesByTrip,
  listPlacesByTrip,
  upsertBooking,
  upsertChecklistItem,
  upsertDay,
  upsertDocument,
  upsertExpense,
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
  EMPTY_BOOKING_FORM,
  EMPTY_DAY_FORM,
  EMPTY_DOCUMENT_FORM,
  EMPTY_EXPENSE_FORM,
  EMPTY_INSERT_DAY_FORM,
  EMPTY_PLACE_FORM,
  type BookingFormValues,
  getLastDayDate,
  type ChecklistFormValues,
  type DayFormValues,
  type DocumentFormValues,
  type ExpenseFormValues,
  type InsertDayFormValues,
  type PlaceFormValues,
  type TripDetailSectionData
} from "./types";

export function useTripDetailData(tripId?: string) {
  const { t } = useTranslation();
  const [data, setData] = useState<TripDetailSectionData>({
    daysWithPlaces: [],
    places: [],
    expenses: [],
    bookings: [],
    documents: [],
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
  const [expenseForm, setExpenseForm] =
    useState<ExpenseFormValues>(EMPTY_EXPENSE_FORM);
  const [bookingForm, setBookingForm] =
    useState<BookingFormValues>(EMPTY_BOOKING_FORM);
  const [documentForm, setDocumentForm] =
    useState<DocumentFormValues>(EMPTY_DOCUMENT_FORM);
  const [editingExpenseId, setEditingExpenseId] = useState<string>();
  const [editExpenseForms, setEditExpenseForms] = useState<
    Record<string, ExpenseFormValues>
  >({});
  const [editingBookingId, setEditingBookingId] = useState<string>();
  const [editBookingForms, setEditBookingForms] = useState<
    Record<string, BookingFormValues>
  >({});
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
          expenses: [],
          bookings: [],
          documents: [],
          checklistItems: [],
          isLoading: false
        });
        return;
      }

      const [
        loadedDays,
        loadedPlaces,
        loadedExpenses,
        loadedBookings,
        loadedDocuments,
        loadedChecklistItems
      ] = await Promise.all([
        listDaysByTrip(tripId),
        listPlacesByTrip(tripId),
        listExpensesByTrip(tripId),
        listBookingsByTrip(tripId),
        listDocumentsByTrip(tripId),
        listChecklistItemsByTrip(tripId)
      ]);

      setData({
        trip: loadedTrip,
        daysWithPlaces: groupPlacesByDay(loadedDays, loadedPlaces),
        places: loadedPlaces,
        expenses: loadedExpenses,
        bookings: loadedBookings,
        documents: loadedDocuments,
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

  const handleAddExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.trip) {
      return;
    }

    const title = expenseForm.title.trim();
    const amount = Number(expenseForm.amount);
    const currency = expenseForm.currency.trim().toUpperCase();
    const category = expenseForm.category.trim();

    if (!title || !Number.isFinite(amount) || amount <= 0 || !currency || !category) {
      return;
    }

    await upsertExpense({
      id: crypto.randomUUID(),
      tripId: data.trip.id,
      dayId: expenseForm.dayId || undefined,
      title,
      amount,
      currency,
      category,
      paidBy: expenseForm.paidBy.trim() || undefined,
      createdAt: new Date().toISOString()
    });
    setExpenseForm(EMPTY_EXPENSE_FORM);
    await loadTrip();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId);
    await loadTrip();
  };

  const startEditingExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditExpenseForms((current) => ({
      ...current,
      [expense.id]: createExpenseForm(expense)
    }));
  };

  const updateEditExpenseForm = (
    expenseId: string,
    patch: Partial<ExpenseFormValues>
  ) => {
    setEditExpenseForms((current) => ({
      ...current,
      [expenseId]: {
        ...EMPTY_EXPENSE_FORM,
        ...current[expenseId],
        ...patch
      }
    }));
  };

  const cancelEditingExpense = () => {
    setEditingExpenseId(undefined);
  };

  const handleEditExpense = async (
    event: FormEvent<HTMLFormElement>,
    expense: Expense
  ) => {
    event.preventDefault();

    const form = editExpenseForms[expense.id] ?? createExpenseForm(expense);
    const title = form.title.trim();
    const amount = Number(form.amount);
    const currency = form.currency.trim().toUpperCase();
    const category = form.category.trim();

    if (!title || !Number.isFinite(amount) || amount <= 0 || !currency || !category) {
      return;
    }

    await upsertExpense({
      ...expense,
      dayId: form.dayId || undefined,
      title,
      amount,
      currency,
      category,
      paidBy: form.paidBy.trim() || undefined
    });
    setEditingExpenseId(undefined);
    await loadTrip();
  };

  const handleAddBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.trip) {
      return;
    }

    const title = bookingForm.title.trim();

    if (!title) {
      return;
    }

    await upsertBooking({
      id: crypto.randomUUID(),
      tripId: data.trip.id,
      type: bookingForm.type,
      title,
      confirmationCode: bookingForm.confirmationCode.trim() || undefined,
      startsAt: bookingForm.startsAt || undefined,
      endsAt: bookingForm.endsAt || undefined,
      address: bookingForm.address.trim() || undefined,
      addressZh: bookingForm.addressZh.trim() || undefined,
      notes: bookingForm.notes.trim() || undefined
    });
    setBookingForm(EMPTY_BOOKING_FORM);
    await loadTrip();
  };

  const handleDeleteBooking = async (bookingId: string) => {
    await deleteBooking(bookingId);
    await loadTrip();
  };

  const startEditingBooking = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setEditBookingForms((current) => ({
      ...current,
      [booking.id]: createBookingForm(booking)
    }));
  };

  const updateEditBookingForm = (
    bookingId: string,
    patch: Partial<BookingFormValues>
  ) => {
    setEditBookingForms((current) => ({
      ...current,
      [bookingId]: {
        ...EMPTY_BOOKING_FORM,
        ...current[bookingId],
        ...patch
      }
    }));
  };

  const cancelEditingBooking = () => {
    setEditingBookingId(undefined);
  };

  const handleEditBooking = async (
    event: FormEvent<HTMLFormElement>,
    booking: Booking
  ) => {
    event.preventDefault();

    const form = editBookingForms[booking.id] ?? createBookingForm(booking);
    const title = form.title.trim();

    if (!title) {
      return;
    }

    await upsertBooking({
      ...booking,
      type: form.type,
      title,
      confirmationCode: form.confirmationCode.trim() || undefined,
      startsAt: form.startsAt || undefined,
      endsAt: form.endsAt || undefined,
      address: form.address.trim() || undefined,
      addressZh: form.addressZh.trim() || undefined,
      notes: form.notes.trim() || undefined
    });
    setEditingBookingId(undefined);
    await loadTrip();
  };

  const handleAddDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.trip) {
      return;
    }

    const title = documentForm.title.trim();

    if (!title) {
      return;
    }

    await upsertDocument({
      id: crypto.randomUUID(),
      tripId: data.trip.id,
      title,
      type: documentForm.type,
      notes: documentForm.notes.trim() || undefined,
      createdAt: new Date().toISOString()
    });
    setDocumentForm(EMPTY_DOCUMENT_FORM);
    await loadTrip();
  };

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocument(documentId);
    await loadTrip();
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
    expenseForm,
    bookingForm,
    documentForm,
    editingExpenseId,
    editExpenseForms,
    editingBookingId,
    editBookingForms,
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
    setExpenseForm,
    handleAddExpense,
    handleDeleteExpense,
    startEditingExpense,
    updateEditExpenseForm,
    cancelEditingExpense,
    handleEditExpense,
    setBookingForm,
    handleAddBooking,
    handleDeleteBooking,
    startEditingBooking,
    updateEditBookingForm,
    cancelEditingBooking,
    handleEditBooking,
    setDocumentForm,
    handleAddDocument,
    handleDeleteDocument,
    setChecklistForm,
    handleToggleChecklistItem,
    handleAddChecklistItem,
    handleDeleteChecklistItem
  };
}

function createExpenseForm(expense: Expense): ExpenseFormValues {
  return {
    title: expense.title,
    amount: expense.amount.toString(),
    currency: expense.currency,
    category: expense.category,
    paidBy: expense.paidBy ?? "",
    dayId: expense.dayId ?? ""
  };
}

function createBookingForm(booking: Booking): BookingFormValues {
  return {
    type: booking.type,
    title: booking.title,
    confirmationCode: booking.confirmationCode ?? "",
    startsAt: booking.startsAt ?? "",
    endsAt: booking.endsAt ?? "",
    address: booking.address ?? "",
    addressZh: booking.addressZh ?? "",
    notes: booking.notes ?? ""
  };
}
