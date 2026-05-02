import { describe, expect, it } from "vitest";

import type { Place } from "../db/database";
import { buildAmapSearchUrl, getBestAmapSearchQuery } from "./amapLinks";

const basePlace: Place = {
  id: "place",
  tripId: "trip",
  name: "Forbidden City",
  orderIndex: 0
};

describe("amapLinks", () => {
  it("uses Chinese address first", () => {
    expect(
      getBestAmapSearchQuery({
        ...basePlace,
        address: "4 Jingshan Front St",
        addressZh: "北京市东城区景山前街4号",
        nameZh: "故宫博物院"
      })
    ).toBe("北京市东城区景山前街4号");
  });

  it("falls back to Chinese name", () => {
    expect(
      getBestAmapSearchQuery({
        ...basePlace,
        address: "4 Jingshan Front St",
        nameZh: "故宫博物院"
      })
    ).toBe("故宫博物院");
  });

  it("encodes URL parameters", () => {
    const url = buildAmapSearchUrl({
      ...basePlace,
      addressZh: "上海市黄浦区 中山东一路"
    });

    expect(url).toContain("https://uri.amap.com/search?");
    expect(url).toContain(
      "keyword=%E4%B8%8A%E6%B5%B7%E5%B8%82%E9%BB%84%E6%B5%A6%E5%8C%BA+%E4%B8%AD%E5%B1%B1%E4%B8%9C%E4%B8%80%E8%B7%AF"
    );
    expect(url).toContain("view=map");
    expect(url).toContain("src=tripforge");
  });

  it("adds center when lat and lng exist", () => {
    expect(
      buildAmapSearchUrl({
        ...basePlace,
        addressZh: "北京市东城区景山前街4号",
        lat: 39.9163,
        lng: 116.3972
      })
    ).toContain("center=116.3972%2C39.9163");
  });
});
