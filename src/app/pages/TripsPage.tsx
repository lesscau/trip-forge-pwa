import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { createDemoChinaTrip } from "../../db/demoSeed";
import {
  createTrip,
  importTripJsonPayload,
  listTrips
} from "../../db/repositories";
import type { Trip } from "../../db/database";
import {
  getTripImportPreview,
  parseTripExportJson,
  type TripExportPayload,
  type TripImportPreview
} from "../../export/tripJson";
import { isValidDateRange } from "../../shared/dateValidation";
import { formatTripDateRange } from "../../shared/format";

export function TripsPage() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [importErrorMessage, setImportErrorMessage] = useState<string>();
  const [importPayload, setImportPayload] = useState<TripExportPayload>();
  const [importPreview, setImportPreview] = useState<TripImportPreview>();
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

    if (!isValidDateRange(formData.startDate, formData.endDate)) {
      setErrorMessage(t("trips.invalidDateRange"));
      return;
    }

    try {
      const trip = await createTrip(formData);
      void navigate(`/trips/${trip.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("trips.createTripError")
      );
    }
  };

  const handleImportFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setImportErrorMessage(undefined);
    setImportPayload(undefined);
    setImportPreview(undefined);

    if (!file) {
      return;
    }

    try {
      const payload = parseTripExportJson(await file.text());
      setImportPayload(payload);
      setImportPreview(getTripImportPreview(payload));
    } catch (error) {
      setImportErrorMessage(
        getTripImportErrorMessage(error, t)
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleConfirmImport = async () => {
    if (!importPayload) {
      return;
    }

    setImportErrorMessage(undefined);

    try {
      const importedTrip = await importTripJsonPayload(importPayload);
      setImportPayload(undefined);
      setImportPreview(undefined);
      await loadTrips();
      void navigate(`/trips/${importedTrip.id}`);
    } catch (error) {
      setImportErrorMessage(
        getTripImportErrorMessage(error, t)
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
      <section className="form-panel">
        <div>
          <p className="eyebrow">{t("tripBackup.importEyebrow")}</p>
          <h2>{t("tripBackup.importButton")}</h2>
        </div>
        <label>
          <span>{t("tripBackup.importFile")}</span>
          <input
            accept="application/json,.json"
            onChange={(event) => void handleImportFileChange(event)}
            type="file"
          />
        </label>
        {importErrorMessage ? (
          <p className="status-message">{importErrorMessage}</p>
        ) : null}
        {importPreview ? (
          <article className="focus-card">
            <span>{t("tripBackup.previewTitle")}</span>
            <strong>{importPreview.title}</strong>
            <p>
              {formatTripDateRange(
                importPreview.startDate,
                importPreview.endDate,
                i18n.language
              )}
            </p>
            <dl className="storage-details">
              <div>
                <dt>{t("tripBackup.previewDays")}</dt>
                <dd>{importPreview.dayCount}</dd>
              </div>
              <div>
                <dt>{t("tripBackup.previewPlaces")}</dt>
                <dd>{importPreview.placeCount}</dd>
              </div>
              <div>
                <dt>{t("tripBackup.previewExpenses")}</dt>
                <dd>{importPreview.expenseCount}</dd>
              </div>
            </dl>
            <div className="button-row">
              <button
                className="primary-action"
                onClick={() => void handleConfirmImport()}
                type="button"
              >
                {t("tripBackup.confirmImport")}
              </button>
              <button
                className="secondary-action"
                onClick={() => {
                  setImportPayload(undefined);
                  setImportPreview(undefined);
                }}
                type="button"
              >
                {t("common.cancel")}
              </button>
            </div>
          </article>
        ) : null}
      </section>
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

function getTripImportErrorMessage(
  error: unknown,
  t: ReturnType<typeof useTranslation>["t"]
): string {
  if (!(error instanceof Error)) {
    return t("tripBackup.importError");
  }

  if (error.message === "Invalid JSON file.") {
    return t("tripBackup.invalidJson");
  }

  if (error.message === "Unsupported TripForge backup schema version.") {
    return t("tripBackup.unsupportedSchemaVersion");
  }

  if (error.message === "This file is not a valid TripForge trip backup.") {
    return t("tripBackup.invalidBackup");
  }

  return error.message;
}
