import { describe, expect, it } from "vitest";

import {
  getPlaceCategoryLabelKey,
  normalizePlaceCategory
} from "./placeCategories";

describe("place categories", () => {
  it("normalizes known category values", () => {
    expect(normalizePlaceCategory("museum")).toBe("museum");
    expect(normalizePlaceCategory("airport")).toBe("airport");
  });

  it("falls back to other for unknown category values", () => {
    expect(normalizePlaceCategory("unknown")).toBe("other");
    expect(normalizePlaceCategory(undefined)).toBe("other");
    expect(normalizePlaceCategory(123)).toBe("other");
  });

  it("returns i18n label keys", () => {
    expect(getPlaceCategoryLabelKey("park")).toBe("placeCategories.park");
  });
});
