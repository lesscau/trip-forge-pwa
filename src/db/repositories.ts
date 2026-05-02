import { db } from "./database";
import type {
  Booking,
  ChecklistItem,
  Expense,
  Note,
  Place,
  TravelDocument,
  Trip,
  TripDay
} from "./database";
import {
  buildTripExportPayload,
  remapTripExportPayload,
  type TripExportPayload
} from "../export/tripJson";

export type CreateTripInput = Pick<
  Trip,
  "title" | "destinationCountry" | "startDate" | "endDate"
>;

function createId(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

function byOrderThenDate(left: TripDay, right: TripDay): number {
  return left.orderIndex - right.orderIndex || left.date.localeCompare(right.date);
}

function byOrderIndex<T extends { orderIndex: number }>(left: T, right: T): number {
  return left.orderIndex - right.orderIndex;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
  const timestamp = nowIso();
  const trip: Trip = {
    id: createId(),
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await db.trips.add(trip);
  return trip;
}

export async function listTrips(): Promise<Trip[]> {
  return db.trips.orderBy("startDate").toArray();
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  return db.trips.get(id);
}

export async function updateTrip(
  id: string,
  changes: Partial<Omit<Trip, "id" | "createdAt">>
): Promise<Trip | undefined> {
  await db.trips.update(id, {
    ...changes,
    updatedAt: nowIso()
  });
  return getTrip(id);
}

export async function deleteTrip(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [
      db.trips,
      db.tripDays,
      db.places,
      db.expenses,
      db.bookings,
      db.travelDocuments,
      db.notes,
      db.checklistItems
    ],
    async () => {
      await Promise.all([
        db.tripDays.where("tripId").equals(id).delete(),
        db.places.where("tripId").equals(id).delete(),
        db.expenses.where("tripId").equals(id).delete(),
        db.bookings.where("tripId").equals(id).delete(),
        db.travelDocuments.where("tripId").equals(id).delete(),
        db.notes.where("tripId").equals(id).delete(),
        db.checklistItems.where("tripId").equals(id).delete()
      ]);
      await db.trips.delete(id);
    }
  );
}

export async function listDaysByTrip(tripId: string): Promise<TripDay[]> {
  const days = await db.tripDays.where("tripId").equals(tripId).toArray();
  return days.sort(byOrderThenDate);
}

export async function upsertDay(day: TripDay): Promise<TripDay> {
  await db.tripDays.put(day);
  return day;
}

export async function deleteDay(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [db.tripDays, db.places, db.expenses, db.bookings, db.notes],
    async () => {
      await Promise.all([
        db.places.where("dayId").equals(id).delete(),
        db.expenses.where("dayId").equals(id).delete(),
        db.bookings.where("dayId").equals(id).delete(),
        db.notes.where("dayId").equals(id).delete()
      ]);
      await db.tripDays.delete(id);
    }
  );
}

export async function listPlacesByTrip(tripId: string): Promise<Place[]> {
  const places = await db.places.where("tripId").equals(tripId).toArray();
  return places.sort(byOrderIndex);
}

export async function listPlacesByDay(dayId: string): Promise<Place[]> {
  const places = await db.places.where("dayId").equals(dayId).toArray();
  return places.sort(byOrderIndex);
}

export async function upsertPlace(place: Place): Promise<Place> {
  await db.places.put(place);
  return place;
}

export async function deletePlace(id: string): Promise<void> {
  await db.places.delete(id);
}

export async function listExpensesByTrip(tripId: string): Promise<Expense[]> {
  return db.expenses.where("tripId").equals(tripId).sortBy("createdAt");
}

export async function upsertExpense(expense: Expense): Promise<Expense> {
  await db.expenses.put(expense);
  return expense;
}

export async function deleteExpense(id: string): Promise<void> {
  await db.expenses.delete(id);
}

export async function listBookingsByTrip(tripId: string): Promise<Booking[]> {
  return db.bookings.where("tripId").equals(tripId).sortBy("startsAt");
}

export async function upsertBooking(booking: Booking): Promise<Booking> {
  await db.bookings.put(booking);
  return booking;
}

export async function deleteBooking(id: string): Promise<void> {
  await db.bookings.delete(id);
}

export async function listDocumentsByTrip(
  tripId: string
): Promise<TravelDocument[]> {
  return db.travelDocuments.where("tripId").equals(tripId).sortBy("createdAt");
}

export async function upsertDocument(
  document: TravelDocument
): Promise<TravelDocument> {
  await db.travelDocuments.put(document);
  return document;
}

export async function deleteDocument(id: string): Promise<void> {
  await db.travelDocuments.delete(id);
}

export async function listNotesByTrip(tripId: string): Promise<Note[]> {
  return db.notes.where("tripId").equals(tripId).sortBy("updatedAt");
}

export async function upsertNote(note: Note): Promise<Note> {
  await db.notes.put(note);
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}

export async function listChecklistItemsByTrip(
  tripId: string
): Promise<ChecklistItem[]> {
  const items = await db.checklistItems.where("tripId").equals(tripId).toArray();
  return items.sort(byOrderIndex);
}

export async function upsertChecklistItem(
  item: ChecklistItem
): Promise<ChecklistItem> {
  await db.checklistItems.put(item);
  return item;
}

export async function deleteChecklistItem(id: string): Promise<void> {
  await db.checklistItems.delete(id);
}

export async function exportTripJsonPayload(
  tripId: string
): Promise<TripExportPayload | undefined> {
  const trip = await getTrip(tripId);

  if (!trip) {
    return undefined;
  }

  const [
    days,
    places,
    expenses,
    bookings,
    documents,
    notes,
    checklistItems
  ] = await Promise.all([
    listDaysByTrip(tripId),
    listPlacesByTrip(tripId),
    listExpensesByTrip(tripId),
    listBookingsByTrip(tripId),
    listDocumentsByTrip(tripId),
    listNotesByTrip(tripId),
    listChecklistItemsByTrip(tripId)
  ]);

  return buildTripExportPayload({
    trip,
    days,
    places,
    expenses,
    bookings,
    documents,
    notes,
    checklistItems
  });
}

export async function importTripJsonPayload(
  payload: TripExportPayload
): Promise<Trip> {
  const remappedData = remapTripExportPayload(
    payload,
    createId,
    nowIso()
  );

  await db.transaction(
    "rw",
    [
      db.trips,
      db.tripDays,
      db.places,
      db.expenses,
      db.bookings,
      db.travelDocuments,
      db.notes,
      db.checklistItems
    ],
    async () => {
      await db.trips.add(remappedData.trip);
      await db.tripDays.bulkAdd(remappedData.days);
      await db.places.bulkAdd(remappedData.places);
      await db.expenses.bulkAdd(remappedData.expenses);
      await db.bookings.bulkAdd(remappedData.bookings);
      await db.travelDocuments.bulkAdd(remappedData.documents);
      await db.notes.bulkAdd(remappedData.notes);
      await db.checklistItems.bulkAdd(remappedData.checklistItems);
    }
  );

  return remappedData.trip;
}
