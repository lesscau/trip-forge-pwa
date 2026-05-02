import { describe, expect, it } from "vitest";

import type { TripExportPayload } from "./tripJson";
import {
  buildTripExportPayload,
  parseTripExportJson,
  remapTripExportPayload,
  tripExportAppName,
  tripExportSchemaVersion
} from "./tripJson";

const payloadData = {
  trip: {
    id: "trip",
    title: "China 2026",
    destinationCountry: "China",
    startDate: "2026-05-02",
    endDate: "2026-05-10",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z"
  },
  days: [
    {
      id: "day",
      tripId: "trip",
      date: "2026-05-02",
      city: "Beijing",
      orderIndex: 0
    }
  ],
  places: [
    {
      id: "place",
      tripId: "trip",
      dayId: "day",
      name: "Forbidden City",
      orderIndex: 0
    }
  ],
  expenses: [
    {
      id: "expense",
      tripId: "trip",
      dayId: "day",
      title: "Ticket",
      amount: 60,
      currency: "CNY",
      category: "tickets",
      createdAt: "2026-05-02T10:00:00.000Z"
    }
  ],
  bookings: [],
  documents: [],
  notes: [],
  checklistItems: [
    {
      id: "check",
      tripId: "trip",
      title: "Passport",
      completed: false,
      orderIndex: 0
    }
  ]
};

describe("trip JSON export/import", () => {
  it("builds the export structure", () => {
    expect(
      buildTripExportPayload(payloadData, "2026-05-02T00:00:00.000Z")
    ).toMatchObject({
      schemaVersion: tripExportSchemaVersion,
      exportedAt: "2026-05-02T00:00:00.000Z",
      appName: tripExportAppName,
      trip: { id: "trip" },
      days: [{ id: "day" }],
      places: [{ id: "place" }],
      expenses: [{ id: "expense" }],
      checklistItems: [{ id: "check" }]
    });
  });

  it("validates import JSON", () => {
    const payload = buildTripExportPayload(payloadData);

    expect(parseTripExportJson(JSON.stringify(payload)).trip.title).toBe(
      "China 2026"
    );
    expect(() =>
      parseTripExportJson(JSON.stringify({ ...payload, schemaVersion: 999 }))
    ).toThrow("Unsupported TripForge backup schema version.");
    expect(() => parseTripExportJson("{")).toThrow("Invalid JSON file.");
  });

  it("remaps ids for imported trips", () => {
    const payload: TripExportPayload = buildTripExportPayload(payloadData);
    const ids = [
      "new-trip",
      "new-day",
      "new-place",
      "new-expense",
      "new-check"
    ];
    const remapped = remapTripExportPayload(
      payload,
      () => ids.shift() ?? "extra-id",
      "2026-06-01T00:00:00.000Z"
    );

    expect(remapped.trip.id).toBe("new-trip");
    expect(remapped.days[0]).toMatchObject({
      id: "new-day",
      tripId: "new-trip"
    });
    expect(remapped.places[0]).toMatchObject({
      id: "new-place",
      tripId: "new-trip",
      dayId: "new-day"
    });
    expect(remapped.expenses[0]).toMatchObject({
      id: "new-expense",
      tripId: "new-trip",
      dayId: "new-day"
    });
    expect(remapped.checklistItems[0]).toMatchObject({
      id: "new-check",
      tripId: "new-trip"
    });
  });
});
