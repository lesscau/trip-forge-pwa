import type { Place, PlaceCategory, TripDay } from "../../db/database";

export type PlaceGroupBy = "city" | "category" | "none";

export type PlaceFilters = {
  search: string;
  city: string;
  category: PlaceCategory | "";
  dayId: string;
};

export type PlaceGroup = {
  key: string;
  places: Place[];
};

const noGroupingKey = "all";
const emptyCityKey = "__empty_city__";

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function containsSearch(place: Place, search: string): boolean {
  if (!search) {
    return true;
  }

  return [place.name, place.nameZh, place.address, place.addressZh, place.notes]
    .filter(Boolean)
    .some((value) => normalizeSearch(value ?? "").includes(search));
}

export function filterPlaces(places: Place[], filters: PlaceFilters): Place[] {
  const search = normalizeSearch(filters.search);

  return places.filter((place) => {
    if (filters.city && place.city !== filters.city) {
      return false;
    }

    if (filters.category && (place.category ?? "other") !== filters.category) {
      return false;
    }

    if (filters.dayId && place.dayId !== filters.dayId) {
      return false;
    }

    return containsSearch(place, search);
  });
}

export function groupPlaces(places: Place[], groupBy: PlaceGroupBy): PlaceGroup[] {
  if (groupBy === "none") {
    return [{ key: noGroupingKey, places }];
  }

  const groups = new Map<string, Place[]>();

  for (const place of places) {
    const key =
      groupBy === "city" ? place.city?.trim() || emptyCityKey : place.category ?? "other";
    groups.set(key, [...(groups.get(key) ?? []), place]);
  }

  return Array.from(groups, ([key, groupedPlaces]) => ({
    key,
    places: groupedPlaces
  })).sort((left, right) => left.key.localeCompare(right.key));
}

export function getPlaceDayLabel(
  place: Pick<Place, "dayId">,
  days: TripDay[]
): string | undefined {
  if (!place.dayId) {
    return undefined;
  }

  const day = days.find((currentDay) => currentDay.id === place.dayId);
  if (!day) {
    return undefined;
  }

  return `${day.date} · ${day.city}`;
}

export const placeGroupKeys = {
  noGrouping: noGroupingKey,
  emptyCity: emptyCityKey
} as const;
