import type { PlaceCategory } from "../../db/database";

export const placeCategories: PlaceCategory[] = [
  "attraction",
  "food",
  "station",
  "airport",
  "hotel",
  "shopping",
  "walk",
  "museum",
  "park",
  "other"
];

export function getPlaceCategoryLabelKey(category: PlaceCategory): string {
  return `placeCategories.${category}`;
}

export function normalizePlaceCategory(value: unknown): PlaceCategory {
  return typeof value === "string" &&
    placeCategories.includes(value as PlaceCategory)
    ? (value as PlaceCategory)
    : "other";
}
