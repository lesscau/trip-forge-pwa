import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  en,
  getCurrentLanguage,
  ru,
  setCurrentLanguage,
  type SupportedLanguage
} from ".";

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
    clear: vi.fn(() => {
      values.clear();
    }),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    get length() {
      return values.size;
    }
  } satisfies Storage;
}

describe("i18n resources", () => {
  it("keeps ru and en top-level keys aligned", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(ru).sort());
  });
});

describe("language helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
  });

  it("defaults to Russian", () => {
    expect(getCurrentLanguage()).toBe("ru");
  });

  it("stores and reads selected language", () => {
    setCurrentLanguage("en");

    expect(getCurrentLanguage()).toBe("en");
  });

  it("ignores unsupported stored values", () => {
    localStorage.setItem("tripforge.language", "de" satisfies string);

    expect(getCurrentLanguage()).toBe("ru" satisfies SupportedLanguage);
  });
});
