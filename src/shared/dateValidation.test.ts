import { describe, expect, it } from "vitest";

import { isDateWithinRange, isValidDateRange } from "./dateValidation";

describe("date range validation", () => {
  it("allows an end date on or after the start date", () => {
    expect(isValidDateRange("2026-05-02", "2026-05-02")).toBe(true);
    expect(isValidDateRange("2026-05-02", "2026-05-03")).toBe(true);
  });

  it("rejects an end date before the start date", () => {
    expect(isValidDateRange("2026-05-03", "2026-05-02")).toBe(false);
  });

  it("checks whether a date belongs to a date range", () => {
    expect(isDateWithinRange("2026-05-02", "2026-05-02", "2026-05-10")).toBe(
      true
    );
    expect(isDateWithinRange("2026-05-10", "2026-05-02", "2026-05-10")).toBe(
      true
    );
    expect(isDateWithinRange("2026-05-11", "2026-05-02", "2026-05-10")).toBe(
      false
    );
  });
});
