import type { Place } from "../db/database";

type AmapPlace = Pick<
  Place,
  "address" | "addressZh" | "lat" | "lng" | "name" | "nameZh"
>;

export function getBestAmapSearchQuery(place: AmapPlace): string {
  return (
    place.addressZh?.trim() ||
    place.nameZh?.trim() ||
    place.address?.trim() ||
    place.name.trim()
  );
}

export function buildAmapSearchUrl(place: AmapPlace): string {
  const url = new URL("https://uri.amap.com/search");
  url.searchParams.set("keyword", getBestAmapSearchQuery(place));
  url.searchParams.set("view", "map");
  url.searchParams.set("src", "tripforge");

  if (place.lng !== undefined && place.lat !== undefined) {
    url.searchParams.set("center", `${place.lng},${place.lat}`);
  }

  return url.toString();
}
