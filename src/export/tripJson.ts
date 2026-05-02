import { z } from "zod";

import type {
  Booking,
  ChecklistItem,
  Expense,
  Note,
  Place,
  TravelDocument,
  Trip,
  TripDay
} from "../db/database";
import {
  bookingSchema,
  checklistItemSchema,
  expenseSchema,
  noteSchema,
  placeSchema,
  travelDocumentSchema,
  tripDaySchema,
  tripSchema
} from "../db/validation";

export const tripExportSchemaVersion = 1;
export const tripExportAppName = "TripForge";

export type TripExportData = {
  trip: Trip;
  days: TripDay[];
  places: Place[];
  expenses: Expense[];
  bookings: Booking[];
  documents: TravelDocument[];
  notes: Note[];
  checklistItems: ChecklistItem[];
};

export const tripExportPayloadSchema = z.object({
  schemaVersion: z.literal(tripExportSchemaVersion),
  exportedAt: z.string(),
  appName: z.literal(tripExportAppName),
  trip: tripSchema,
  days: z.array(tripDaySchema),
  places: z.array(placeSchema),
  expenses: z.array(expenseSchema),
  bookings: z.array(bookingSchema),
  documents: z.array(travelDocumentSchema),
  notes: z.array(noteSchema),
  checklistItems: z.array(checklistItemSchema)
});

export type TripExportPayload = z.infer<typeof tripExportPayloadSchema>;

export type TripImportPreview = {
  title: string;
  startDate: string;
  endDate: string;
  dayCount: number;
  placeCount: number;
  expenseCount: number;
};

export function buildTripExportPayload(
  data: TripExportData,
  exportedAt = new Date().toISOString()
): TripExportPayload {
  return {
    schemaVersion: tripExportSchemaVersion,
    exportedAt,
    appName: tripExportAppName,
    trip: data.trip,
    days: data.days,
    places: data.places,
    expenses: data.expenses,
    bookings: data.bookings,
    documents: data.documents,
    notes: data.notes,
    checklistItems: data.checklistItems
  };
}

export function parseTripExportJson(jsonText: string): TripExportPayload {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON file.");
  }

  if (
    typeof parsedJson === "object" &&
    parsedJson !== null &&
    "schemaVersion" in parsedJson &&
    parsedJson.schemaVersion !== tripExportSchemaVersion
  ) {
    throw new Error("Unsupported TripForge backup schema version.");
  }

  const result = tripExportPayloadSchema.safeParse(parsedJson);

  if (!result.success) {
    throw new Error("This file is not a valid TripForge trip backup.");
  }

  return result.data;
}

export function getTripImportPreview(
  payload: TripExportPayload
): TripImportPreview {
  return {
    title: payload.trip.title,
    startDate: payload.trip.startDate,
    endDate: payload.trip.endDate,
    dayCount: payload.days.length,
    placeCount: payload.places.length,
    expenseCount: payload.expenses.length
  };
}

export function remapTripExportPayload(
  payload: TripExportPayload,
  createId: () => string,
  importedAt = new Date().toISOString()
): TripExportData {
  const tripId = createId();
  const dayIdMap = new Map(payload.days.map((day) => [day.id, createId()]));

  const remapDayId = (dayId?: string) =>
    dayId ? dayIdMap.get(dayId) : undefined;

  return {
    trip: {
      ...payload.trip,
      id: tripId,
      createdAt: importedAt,
      updatedAt: importedAt
    },
    days: payload.days.map((day) => ({
      ...day,
      id: dayIdMap.get(day.id) ?? createId(),
      tripId
    })),
    places: payload.places.map((place) => ({
      ...place,
      id: createId(),
      tripId,
      dayId: remapDayId(place.dayId)
    })),
    expenses: payload.expenses.map((expense) => ({
      ...expense,
      id: createId(),
      tripId,
      dayId: remapDayId(expense.dayId)
    })),
    bookings: payload.bookings.map((booking) => ({
      ...booking,
      id: createId(),
      tripId,
      dayId: remapDayId(booking.dayId)
    })),
    documents: payload.documents.map((document) => ({
      ...document,
      id: createId(),
      tripId
    })),
    notes: payload.notes.map((note) => ({
      ...note,
      id: createId(),
      tripId,
      dayId: remapDayId(note.dayId)
    })),
    checklistItems: payload.checklistItems.map((item) => ({
      ...item,
      id: createId(),
      tripId
    }))
  };
}

export function createTripExportFilename(
  tripTitle: string,
  exportedAt = new Date()
): string {
  const safeTitle = tripTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  const date = exportedAt.toISOString().slice(0, 10);

  return `tripforge-${safeTitle || "trip"}-${date}.json`;
}
