import { describe, expect, it } from "vitest";

import type { Place } from "../db/database";
import { getMappablePlaces, getPolylinePoints } from "./placesMap";

const places: Place[] = [
  {
    id: "without-coordinates",
    tripId: "trip",
    name: "No coordinates",
    orderIndex: 0
  },
  {
    id: "second",
    tripId: "trip",
    name: "Second",
    lat: 31.2403,
    lng: 121.4906,
    orderIndex: 2
  },
  {
    id: "first",
    tripId: "trip",
    name: "First",
    lat: 39.9163,
    lng: 116.3972,
    orderIndex: 1
  }
];

describe("placesMap", () => {
  it("returns only places with coordinates", () => {
    expect(getMappablePlaces(places).map((place) => place.id)).toEqual([
      "second",
      "first"
    ]);
  });

  it("sorts polyline points by orderIndex", () => {
    expect(getPolylinePoints(places)).toEqual([
      [39.9163, 116.3972],
      [31.2403, 121.4906]
    ]);
  });

  it("returns no polyline when less than two points exist", () => {
    expect(getPolylinePoints([places[1]])).toEqual([]);
  });
});
