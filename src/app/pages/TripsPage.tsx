import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const sampleTrips = [
  {
    id: "china-2026",
    nameKey: "trips.sampleName",
    datesKey: "trips.sampleDates"
  }
];

export function TripsPage() {
  const { t } = useTranslation();

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("trips.eyebrow")}</p>
        <h1>{t("trips.title")}</h1>
      </div>
      <div className="card-grid">
        {sampleTrips.map((trip) => (
          <Link className="trip-card" key={trip.id} to={`/trips/${trip.id}`}>
            <span>{t(trip.datesKey)}</span>
            <strong>{t(trip.nameKey)}</strong>
            <p>{t("trips.cardDescription")}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
