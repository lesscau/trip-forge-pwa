import { describe, expect, it } from "vitest";

import type { Place, TripDay } from "../db/database";
import {
  addDaysToDateKey,
  insertDayAfter,
  moveDayByOffset,
  movePlaceByOffset
} from "./itineraryOrdering";

const days: TripDay[] = [
  {
    id: "day-1",
    tripId: "trip",
    date: "2026-05-02",
    city: "Beijing",
    orderIndex: 0
  },
  {
    id: "day-2",
    tripId: "trip",
    date: "2026-05-03",
    city: "Xi'an",
    orderIndex: 1
  },
  {
    id: "day-3",
    tripId: "trip",
    date: "2026-05-04",
    city: "Shanghai",
    orderIndex: 2
  }
];

describe("itinerary ordering", () => {
  it("adds days to date keys", () => {
    expect(addDaysToDateKey("2026-05-02", 2)).toBe("2026-05-04");
  });

  it("inserts a day and shifts following dates", () => {
    const result = insertDayAfter(
      days,
      {
        id: "day-new",
        tripId: "trip",
        date: "2026-05-02",
        city: "Luoyang",
        orderIndex: 0
      },
      "day-1",
      "2026-05-02"
    );

    expect(result.map((day) => [day.id, day.date, day.orderIndex])).toEqual([
      ["day-1", "2026-05-02", 0],
      ["day-new", "2026-05-03", 1],
      ["day-2", "2026-05-04", 2],
      ["day-3", "2026-05-05", 3]
    ]);
  });

  it("moves a day by one position and recalculates dates", () => {
    const result = moveDayByOffset(days, "day-2", -1, "2026-05-02");

    expect(result.map((day) => [day.id, day.date, day.orderIndex])).toEqual([
      ["day-2", "2026-05-02", 0],
      ["day-1", "2026-05-03", 1],
      ["day-3", "2026-05-04", 2]
    ]);
  });

  it("moves a place by one position inside its day", () => {
    const places: Place[] = [
      {
        id: "place-1",
        tripId: "trip",
        dayId: "day-1",
        name: "A",
        orderIndex: 0
      },
      {
        id: "place-2",
        tripId: "trip",
        dayId: "day-1",
        name: "B",
        orderIndex: 1
      }
    ];

    const result = movePlaceByOffset(places, "place-2", -1)
      .filter((place) => place.dayId === "day-1")
      .sort((left, right) => left.orderIndex - right.orderIndex);

    expect(result.map((place) => [place.id, place.orderIndex])).toEqual([
      ["place-2", 0],
      ["place-1", 1]
    ]);
  });
});
