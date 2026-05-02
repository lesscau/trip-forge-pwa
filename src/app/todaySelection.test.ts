import { describe, expect, it } from "vitest";

import type { Booking, ChecklistItem, Place, Trip, TripDay } from "../db/database";
import { selectTodayTrip } from "./todaySelection";

const trip: Trip = {
  id: "trip",
  title: "China 2026",
  destinationCountry: "China",
  startDate: "2026-05-02",
  endDate: "2026-05-10",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

const days: TripDay[] = [
  {
    id: "day-1",
    tripId: trip.id,
    date: "2026-05-02",
    city: "Beijing",
    orderIndex: 0
  },
  {
    id: "day-2",
    tripId: trip.id,
    date: "2026-05-04",
    city: "Xi'an",
    orderIndex: 1
  }
];

const places: Place[] = [
  {
    id: "place",
    tripId: trip.id,
    dayId: "day-1",
    name: "Forbidden City",
    orderIndex: 0
  }
];

const bookings: Booking[] = [
  {
    id: "booking",
    tripId: trip.id,
    dayId: "day-1",
    type: "hotel",
    title: "Hotel"
  }
];

const checklistItems: ChecklistItem[] = [
  {
    id: "check",
    tripId: trip.id,
    title: "Passport",
    completed: false,
    orderIndex: 0
  }
];

describe("today selection", () => {
  it("selects the exact current day", () => {
    const selection = selectTodayTrip({
      trips: [trip],
      days,
      places,
      bookings,
      checklistItems,
      today: "2026-05-02"
    });

    expect(selection).toMatchObject({
      status: "active",
      day: { id: "day-1" },
      isExactDay: true,
      places: [{ id: "place" }],
      bookings: [{ id: "booking" }],
      checklistItems: [{ id: "check" }]
    });
  });

  it("selects the nearest future day when exact day is missing", () => {
    const selection = selectTodayTrip({
      trips: [trip],
      days,
      places,
      bookings,
      checklistItems,
      today: "2026-05-03"
    });

    expect(selection).toMatchObject({
      status: "active",
      day: { id: "day-2" },
      isExactDay: false
    });
  });

  it("selects the latest past day when active trip has no future planned days", () => {
    const selection = selectTodayTrip({
      trips: [trip],
      days,
      places,
      bookings,
      checklistItems,
      today: "2026-05-08"
    });

    expect(selection).toMatchObject({
      status: "active",
      day: { id: "day-2" },
      isExactDay: false
    });
  });

  it("returns none when there is no active trip", () => {
    expect(
      selectTodayTrip({
        trips: [trip],
        days,
        places,
        bookings,
        checklistItems,
        today: "2026-06-01"
      })
    ).toEqual({ status: "none" });
  });
});
