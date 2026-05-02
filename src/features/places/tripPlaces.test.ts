import { describe, expect, it } from "vitest";

import type { Place, TripDay } from "../../db/database";
import { filterPlaces, groupPlaces } from "./tripPlaces";
import type { PlaceFilters } from "./tripPlaces";

const baseFilters: PlaceFilters = {
  search: "",
  city: "",
  category: "",
  dayId: ""
};

const places: Place[] = [
  {
    id: "forbidden-city",
    tripId: "trip",
    dayId: "beijing-day",
    city: "Beijing",
    category: "museum",
    name: "Forbidden City",
    nameZh: "故宫博物院",
    address: "4 Jingshan Front St",
    addressZh: "北京市东城区景山前街4号",
    notes: "Timed entry",
    orderIndex: 0
  },
  {
    id: "dumplings",
    tripId: "trip",
    dayId: "xian-day",
    city: "Xi'an",
    category: "food",
    name: "Dumpling Dinner",
    nameZh: "饺子宴",
    address: "Defachang",
    addressZh: "西安市钟鼓楼广场",
    notes: "Reserve",
    orderIndex: 1
  },
  {
    id: "bund",
    tripId: "trip",
    dayId: "shanghai-day",
    city: "Shanghai",
    category: "walk",
    name: "The Bund",
    nameZh: "外滩",
    address: "Zhongshan East 1st Road",
    addressZh: "上海市黄浦区中山东一路",
    orderIndex: 2
  }
];

const days: TripDay[] = [
  {
    id: "beijing-day",
    tripId: "trip",
    date: "2026-05-02",
    city: "Beijing",
    orderIndex: 0
  },
  {
    id: "xian-day",
    tripId: "trip",
    date: "2026-05-04",
    city: "Xi'an",
    orderIndex: 1
  }
];

describe("trip places", () => {
  it("filters by city", () => {
    expect(
      filterPlaces(places, { ...baseFilters, city: "Beijing" }).map(
        (place) => place.id
      )
    ).toEqual(["forbidden-city"]);
  });

  it("filters by category", () => {
    expect(
      filterPlaces(places, { ...baseFilters, category: "food" }).map(
        (place) => place.id
      )
    ).toEqual(["dumplings"]);
  });

  it("filters by day", () => {
    expect(
      filterPlaces(places, { ...baseFilters, dayId: days[1].id }).map(
        (place) => place.id
      )
    ).toEqual(["dumplings"]);
  });

  it("searches by Chinese name and address", () => {
    expect(
      filterPlaces(places, { ...baseFilters, search: "故宫" }).map(
        (place) => place.id
      )
    ).toEqual(["forbidden-city"]);

    expect(
      filterPlaces(places, { ...baseFilters, search: "中山东一路" }).map(
        (place) => place.id
      )
    ).toEqual(["bund"]);
  });

  it("groups by city", () => {
    expect(
      groupPlaces(places, "city").map((group) => [
        group.key,
        group.places.map((place) => place.id)
      ])
    ).toEqual([
      ["Beijing", ["forbidden-city"]],
      ["Shanghai", ["bund"]],
      ["Xi'an", ["dumplings"]]
    ]);
  });

  it("groups by category", () => {
    expect(
      groupPlaces(places, "category").map((group) => [
        group.key,
        group.places.map((place) => place.id)
      ])
    ).toEqual([
      ["food", ["dumplings"]],
      ["museum", ["forbidden-city"]],
      ["walk", ["bund"]]
    ]);
  });
});
