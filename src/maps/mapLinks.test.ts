import { describe, expect, it } from "vitest";

import {
  createAmapLink,
  createAppleMapsLink,
  createBaiduMapsLink
} from "./mapLinks";

describe("map link helpers", () => {
  it("creates Apple Maps links with coordinates when present", () => {
    expect(
      createAppleMapsLink({
        name: "Hotel",
        address: "北京市东城区",
        latitude: 39.9042,
        longitude: 116.4074
      })
    ).toBe(
      "https://maps.apple.com/?ll=39.9042,116.4074&q=%E5%8C%97%E4%BA%AC%E5%B8%82%E4%B8%9C%E5%9F%8E%E5%8C%BA"
    );
  });

  it("creates Amap and Baidu links from an address", () => {
    const point = { name: "Station", address: "上海虹桥站" };

    expect(createAmapLink(point)).toContain("%E4%B8%8A%E6%B5%B7");
    expect(createBaiduMapsLink(point)).toContain("output=html");
  });
});
