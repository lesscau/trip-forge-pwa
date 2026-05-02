import type { Place } from "../db/database";

export type MappablePlace = Place & {
  lat: number;
  lng: number;
};

export type LeafletPoint = [number, number];

export function getMappablePlaces(places: Place[]): MappablePlace[] {
  return places.filter(
    (place): place is MappablePlace =>
      typeof place.lat === "number" && typeof place.lng === "number"
  );
}

export function getPolylinePoints(places: Place[]): LeafletPoint[] {
  const mappablePlaces = getMappablePlaces(places).sort(
    (left, right) => left.orderIndex - right.orderIndex
  );

  if (mappablePlaces.length < 2) {
    return [];
  }

  return mappablePlaces.map((place) => [place.lat, place.lng]);
}
