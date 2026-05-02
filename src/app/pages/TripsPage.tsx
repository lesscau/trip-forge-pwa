import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { createDemoChinaTrip } from "../../db/demoSeed";
import { createTrip, listTrips } from "../../db/repositories";
import type { Trip } from "../../db/database";
import { formatTripDateRange } from "../../shared/format";

export function TripsPage() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [formData, setFormData] = useState({
    title: "",
    destinationCountry: "",
    startDate: "",
    endDate: ""
  });

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
      const demo = await createDemoChinaTrip();
      await loadTrips();
      void navigate(`/trips/${demo.trip.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("trips.createDemoError")
      );
    }
  };

  const handleCreateTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(undefined);

    try {
      const trip = await createTrip(formData);
      void navigate(`/trips/${trip.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("trips.createTripError")
      );
    }
  };

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("trips.eyebrow")}</p>
        <h1>{t("trips.title")}</h1>
      </div>

      <form
        className="form-panel"
        onSubmit={(event) => void handleCreateTrip(event)}
      >
        <div>
          <p className="eyebrow">{t("trips.createTripEyebrow")}</p>
          <h2>{t("trips.createTrip")}</h2>
        </div>
        <label>
          <span>{t("trips.form.title")}</span>
          <input
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                title: event.target.value
              }))
            }
            required
            type="text"
            value={formData.title}
          />
        </label>
        <label>
          <span>{t("trips.form.destinationCountry")}</span>
          <input
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                destinationCountry: event.target.value
              }))
            }
            required
            type="text"
            value={formData.destinationCountry}
          />
        </label>
        <div className="form-grid">
          <label>
            <span>{t("trips.form.startDate")}</span>
            <input
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  startDate: event.target.value
                }))
              }
              required
              type="date"
              value={formData.startDate}
            />
          </label>
          <label>
            <span>{t("trips.form.endDate")}</span>
            <input
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  endDate: event.target.value
                }))
              }
              required
              type="date"
              value={formData.endDate}
            />
          </label>
        </div>
        <button className="primary-action" type="submit">
          {t("trips.createTrip")}
        </button>
      </form>

      <div className="button-row">
        <button
          className={trips.length === 0 ? "primary-action" : "secondary-action"}
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
