import { describe, expect, it } from "vitest";

import type { Place, TripDay } from "../db/database";
import { groupPlacesByDay } from "./tripDetailData";

describe("trip detail data grouping", () => {
  it("groups places by day and sorts them by orderIndex", () => {
    const days: TripDay[] = [
      {
        id: "day-1",
        tripId: "trip",
        date: "2026-05-02",
        city: "Beijing",
        orderIndex: 0
      }
    ];
    const places: Place[] = [
      {
        id: "second",
        tripId: "trip",
        dayId: "day-1",
        name: "Second",
        orderIndex: 1
      },
      {
        id: "first",
        tripId: "trip",
        dayId: "day-1",
        name: "First",
        orderIndex: 0
      },
      {
        id: "unassigned",
        tripId: "trip",
        name: "Unassigned",
        orderIndex: 0
      }
    ];

    expect(groupPlacesByDay(days, places)).toEqual([
      {
        day: days[0],
        places: [places[1], places[0]]
      }
    ]);
  });

  it("includes a newly added place with dayId in that day group", () => {
    const days: TripDay[] = [
      {
        id: "day-1",
        tripId: "trip",
        date: "2026-05-02",
        city: "Beijing",
        orderIndex: 0
      }
    ];
    const addedPlace: Place = {
      id: "added",
      tripId: "trip",
      dayId: "day-1",
      name: "Added place",
      orderIndex: 0
    };

    expect(groupPlacesByDay(days, [addedPlace])[0]?.places).toEqual([
      addedPlace
    ]);
  });
});
