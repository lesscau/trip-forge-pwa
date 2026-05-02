export type MapPoint = {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

const encode = (value: string) => encodeURIComponent(value);

export function createAppleMapsLink(point: MapPoint): string {
  const query = point.address ?? point.name;

  if (point.latitude !== undefined && point.longitude !== undefined) {
    return `https://maps.apple.com/?ll=${point.latitude},${point.longitude}&q=${encode(query)}`;
  }

  return `https://maps.apple.com/?q=${encode(query)}`;
}

export function createAmapLink(point: MapPoint): string {
  const query = point.address ?? point.name;
  return `https://uri.amap.com/search?keyword=${encode(query)}`;
}

export function createBaiduMapsLink(point: MapPoint): string {
  const query = point.address ?? point.name;
  return `https://api.map.baidu.com/geocoder?address=${encode(query)}&output=html`;
}
