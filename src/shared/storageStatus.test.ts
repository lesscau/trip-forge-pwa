import { describe, expect, it } from "vitest";

import {
  calculateUsagePercent,
  formatBytes,
  readStorageStatus
} from "./storageStatus";

describe("storage status helpers", () => {
  it("formats byte values for display", () => {
    expect(formatBytes()).toBe("Unknown");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1024 * 1024 * 12)).toBe("12.0 MB");
  });

  it("calculates usage percent when estimate values are available", () => {
    expect(calculateUsagePercent()).toBeUndefined();
    expect(calculateUsagePercent(25, 100)).toBe(25);
    expect(calculateUsagePercent(150, 100)).toBe(100);
  });

  it("reports unsupported storage API", async () => {
    await expect(
      readStorageStatus("Storage failed", {} as Navigator)
    ).resolves.toEqual({
      isSupported: false
    });
  });
});
