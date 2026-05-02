import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { Place } from "../../db/database";
import {
  getMappablePlaces,
  getPolylinePoints,
  type LeafletPoint
} from "../../maps/placesMap";
import { getPlaceCategoryLabelKey } from "./placeCategories";

type TripPlacesMapProps = {
  places: Place[];
  routePlaces: Place[];
  showRoute: boolean;
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export function TripPlacesMap({
  places,
  routePlaces,
  showRoute
}: TripPlacesMapProps) {
  const { t } = useTranslation();
  const mappablePlaces = useMemo(() => getMappablePlaces(places), [places]);
  const polylinePoints = useMemo(
    () => (showRoute ? getPolylinePoints(routePlaces) : []),
    [routePlaces, showRoute]
  );
  const center: LeafletPoint = mappablePlaces[0]
    ? [mappablePlaces[0].lat, mappablePlaces[0].lng]
    : [35.8617, 104.1954];

  if (mappablePlaces.length === 0) {
    return (
      <section className="map-panel">
        <p className="muted-text">{t("tripPlaces.map.noCoordinates")}</p>
      </section>
    );
  }

  return (
    <section className="map-panel" aria-label={t("tripPlaces.map.label")}>
      <MapContainer
        center={center}
        className="leaflet-map-container"
        scrollWheelZoom={false}
        zoom={11}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapToPlaces
          points={mappablePlaces.map((place) => [place.lat, place.lng])}
        />
        {mappablePlaces.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              <div className="place-map-popup">
                <strong>{place.name}</strong>
                {place.nameZh ? <span>{place.nameZh}</span> : null}
                {place.addressZh ? <p>{place.addressZh}</p> : null}
                <p>{t(getPlaceCategoryLabelKey(place.category ?? "other"))}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {polylinePoints.length >= 2 ? (
          <Polyline
            color="#0f766e"
            opacity={0.85}
            positions={polylinePoints}
            weight={5}
          />
        ) : null}
      </MapContainer>
    </section>
  );
}

function FitMapToPlaces({ points }: { points: LeafletPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(points, { padding: [24, 24] });
  }, [map, points]);

  return null;
}
