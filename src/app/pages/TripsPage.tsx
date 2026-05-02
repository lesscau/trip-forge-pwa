import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { createDemoChinaTrip } from "../../db/demoSeed";
import { listTrips } from "../../db/repositories";
import type { Trip } from "../../db/database";
import { formatTripDateRange } from "../../shared/format";

export function TripsPage() {
  const { i18n, t } = useTranslation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      setTrips(await listTrips());
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("trips.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  const handleCreateDemoTrip = async () => {
    setErrorMessage(undefined);

    try {
      await createDemoChinaTrip();
      await loadTrips();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("trips.createDemoError")
      );
    }
  };

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("trips.eyebrow")}</p>
        <h1>{t("trips.title")}</h1>
      </div>
      <div className="button-row">
        <button
          className="primary-action"
          onClick={() => void handleCreateDemoTrip()}
          type="button"
        >
          {t("trips.createDemo")}
        </button>
      </div>
      {errorMessage ? <p className="status-message">{errorMessage}</p> : null}
      {isLoading ? <p className="muted-text">{t("trips.loading")}</p> : null}
      {!isLoading && trips.length === 0 ? (
        <p className="muted-text">{t("trips.empty")}</p>
      ) : null}
      <div className="card-grid">
        {trips.map((trip) => (
          <Link className="trip-card" key={trip.id} to={`/trips/${trip.id}`}>
            <span>
              {formatTripDateRange(trip.startDate, trip.endDate, i18n.language)}
            </span>
            <strong>{trip.title}</strong>
            <p>{t("trips.cardDescription")}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
