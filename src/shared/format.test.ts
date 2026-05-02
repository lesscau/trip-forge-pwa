import { describe, expect, it } from "vitest";

import { formatDate, formatTripDateRange } from "./format";

describe("date formatting", () => {
  it("formats dates with Russian locale by default", () => {
    expect(formatDate("2026-05-02")).toContain("мая");
  });

  it("formats trip date ranges with a locale", () => {
    expect(formatTripDateRange("2026-05-02", "2026-05-04", "ru-RU")).toContain(
      "мая"
    );
  });
});
