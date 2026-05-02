import type { Place, TripDay } from "../db/database";

export function addDaysToDateKey(dateKey: string, daysToAdd: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + daysToAdd);

  return date.toISOString().slice(0, 10);
}

function byOrderThenDate(left: TripDay, right: TripDay): number {
  return left.orderIndex - right.orderIndex || left.date.localeCompare(right.date);
}

function byOrderIndex<T extends { orderIndex: number }>(left: T, right: T): number {
  return left.orderIndex - right.orderIndex;
}

export function normalizeDayOrderAndDates(
  days: TripDay[],
  startDate: string
): TripDay[] {
  return applySequentialDates([...days].sort(byOrderThenDate), startDate);
}

function applySequentialDates(days: TripDay[], startDate: string): TripDay[] {
  return days.map((day, index) => ({
    ...day,
    date: addDaysToDateKey(startDate, index),
    orderIndex: index
  }));
}

export function insertDayAfter(
  days: TripDay[],
  newDay: TripDay,
  afterDayId: string,
  startDate: string
): TripDay[] {
  const orderedDays = [...days].sort(byOrderThenDate);
  const afterIndex = orderedDays.findIndex((day) => day.id === afterDayId);

  if (afterIndex === -1) {
    return applySequentialDates([...orderedDays, newDay], startDate);
  }

  const nextDays = [
    ...orderedDays.slice(0, afterIndex + 1),
    newDay,
    ...orderedDays.slice(afterIndex + 1)
  ];

  return applySequentialDates(nextDays, startDate);
}

export function moveDayByOffset(
  days: TripDay[],
  dayId: string,
  offset: -1 | 1,
  startDate: string
): TripDay[] {
  const orderedDays = [...days].sort(byOrderThenDate);
  const currentIndex = orderedDays.findIndex((day) => day.id === dayId);
  const nextIndex = currentIndex + offset;

  if (
    currentIndex === -1 ||
    nextIndex < 0 ||
    nextIndex >= orderedDays.length
  ) {
    return applySequentialDates(orderedDays, startDate);
  }

  const nextDays = [...orderedDays];
  [nextDays[currentIndex], nextDays[nextIndex]] = [
    nextDays[nextIndex],
    nextDays[currentIndex]
  ];

  return applySequentialDates(nextDays, startDate);
}

export function movePlaceByOffset(
  places: Place[],
  placeId: string,
  offset: -1 | 1
): Place[] {
  const place = places.find((currentPlace) => currentPlace.id === placeId);

  if (!place) {
    return places;
  }

  const dayPlaces = places
    .filter((currentPlace) => currentPlace.dayId === place.dayId)
    .sort(byOrderIndex);
  const currentIndex = dayPlaces.findIndex(
    (currentPlace) => currentPlace.id === placeId
  );
  const nextIndex = currentIndex + offset;

  if (currentIndex === -1 || nextIndex < 0 || nextIndex >= dayPlaces.length) {
    return places;
  }

  const nextDayPlaces = [...dayPlaces];
  [nextDayPlaces[currentIndex], nextDayPlaces[nextIndex]] = [
    nextDayPlaces[nextIndex],
    nextDayPlaces[currentIndex]
  ];
  const reorderedDayPlaces = nextDayPlaces.map((currentPlace, index) => ({
    ...currentPlace,
    orderIndex: index
  }));
  const changedPlaceIds = new Set(
    reorderedDayPlaces.map((currentPlace) => currentPlace.id)
  );

  return [
    ...places.filter((currentPlace) => !changedPlaceIds.has(currentPlace.id)),
    ...reorderedDayPlaces
  ];
}
