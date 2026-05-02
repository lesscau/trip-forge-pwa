import { describe, expect, it } from "vitest";

import { getNextOrderIndex } from "./ordering";

describe("ordering helpers", () => {
  it("returns zero for an empty list", () => {
    expect(getNextOrderIndex([])).toBe(0);
  });

  it("returns the next index after the current maximum", () => {
    expect(
      getNextOrderIndex([{ orderIndex: 0 }, { orderIndex: 4 }, { orderIndex: 2 }])
    ).toBe(5);
  });
});
