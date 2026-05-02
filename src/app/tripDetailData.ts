import type { Place, TripDay } from "../db/database";

export type DayWithPlaces = {
  day: TripDay;
  places: Place[];
};

export function groupPlacesByDay(
  days: TripDay[],
  places: Place[]
): DayWithPlaces[] {
  return days.map((day) => ({
    day,
    places: places
      .filter((place) => place.dayId === day.id)
      .sort((left, right) => left.orderIndex - right.orderIndex)
  }));
}
