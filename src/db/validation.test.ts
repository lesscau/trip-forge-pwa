import { describe, expect, it } from "vitest";

import { placeSchema } from "./validation";

describe("domain validation", () => {
  it("validates place city, category, and coordinates", () => {
    expect(
      placeSchema.safeParse({
        id: "place",
        tripId: "trip",
        dayId: "day",
        city: "Beijing",
        category: "museum",
        name: "Forbidden City",
        lat: 39.9163,
        lng: 116.3972,
        orderIndex: 0
      }).success
    ).toBe(true);
  });

  it("rejects unknown place categories", () => {
    expect(
      placeSchema.safeParse({
        id: "place",
        tripId: "trip",
        category: "unknown",
        name: "Unknown place",
        orderIndex: 0
      }).success
    ).toBe(false);
  });
});
