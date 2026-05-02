import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { Trip } from "../../db/database";
import { formatTripDateRange } from "../../shared/format";

type TripHeaderProps = {
  trip: Trip;
};

export function TripHeader({ trip }: TripHeaderProps) {
  const { i18n, t } = useTranslation();

  return (
    <div className="section-heading">
      <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
      <h1>{trip.title}</h1>
      <p>
        {trip.destinationCountry}{" - "}
        {formatTripDateRange(trip.startDate, trip.endDate, i18n.language)}
      </p>
      <div className="button-row">
        <Link className="secondary-action" to={`/trips/${trip.id}/places`}>
          {t("tripPlaces.navLink")}
        </Link>
      </div>
    </div>
  );
}
