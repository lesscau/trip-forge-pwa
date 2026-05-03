import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type {
  Booking,
  ChecklistItem,
  Place,
  Trip,
  TripDay
} from "../../db/database";
import {
  listBookingsByTrip,
  listChecklistItemsByTrip,
  listDaysByTrip,
  listPlacesByTrip,
  listTrips
} from "../../db/repositories";
import { formatDate } from "../../shared/format";
import { CopyButton } from "../../shared/CopyButton";
import { EmptyState } from "../../shared/EmptyState";
import {
  selectTodayTrip,
  toLocalDateKey,
  type TodaySelection
} from "../todaySelection";
import { PlaceActions } from "../../features/places/PlaceActions";

export function TodayPage() {
  const { i18n, t } = useTranslation();
  const [selection, setSelection] = useState<TodaySelection>({ status: "none" });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadToday = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const trips = await listTrips();
      const activeTrip = trips.find((trip) => {
        const today = toLocalDateKey(new Date());
        return trip.startDate <= today && today <= trip.endDate;
      });

      let days: TripDay[] = [];
      let places: Place[] = [];
      let bookings: Booking[] = [];
      let checklistItems: ChecklistItem[] = [];

      if (activeTrip) {
        [days, places, bookings, checklistItems] = await Promise.all([
          listDaysByTrip(activeTrip.id),
          listPlacesByTrip(activeTrip.id),
          listBookingsByTrip(activeTrip.id),
          listChecklistItemsByTrip(activeTrip.id)
        ]);
      }

      setSelection(
        selectTodayTrip({
          trips: activeTrip ? [activeTrip] : ([] as Trip[]),
          days,
          places,
          bookings,
          checklistItems,
          today: toLocalDateKey(new Date())
        })
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("today.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadToday();
  }, [loadToday]);

  if (isLoading) {
    return <p className="loading-state">{t("common.loading")}</p>;
  }

  if (errorMessage) {
    return <p className="status-message">{errorMessage}</p>;
  }

  return (
    <section className="content-section">
      <div className="section-heading day-sticky-header">
        <p className="eyebrow">{t("today.eyebrow")}</p>
        <h1>{t("today.title")}</h1>
      </div>

      {selection.status === "none" ? (
        <EmptyState title={t("today.emptyTitle")}>
          <p>{t("today.emptyDescription")}</p>
          <Link className="secondary-action" to="/trips">
            {t("today.openTrips")}
          </Link>
        </EmptyState>
      ) : (
        <>
          <article className="focus-card">
            <span>
              {t(`today.selectedDayKinds.${selection.selectedDayKind}`)}
            </span>
            <strong>{selection.trip.title}</strong>
            <p>
              {formatDate(selection.day.date, i18n.language)} ·{" "}
              {selection.day.city}
            </p>
            {selection.day.summary ? <p>{selection.day.summary}</p> : null}
          </article>

          <section className="data-section">
            <h2>{t("tripDetail.sections.places")}</h2>
            {selection.places.length === 0 ? (
              <EmptyState>{t("today.emptyPlaces")}</EmptyState>
            ) : (
              <div className="card-grid">
                {selection.places.map((place) => (
                  <article className="focus-card" key={place.id}>
                    <span>{place.nameZh ?? t("tripDetail.place")}</span>
                    <strong>{place.name}</strong>
                    {place.addressZh ? <p>{place.addressZh}</p> : null}
                    <PlaceActions place={place} />
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="data-section">
            <h2>{t("tripDetail.sections.bookings")}</h2>
            {selection.bookings.length === 0 ? (
              <EmptyState>{t("today.emptyBookings")}</EmptyState>
            ) : (
              <div className="card-grid">
                {selection.bookings.map((booking) => (
                  <article className="focus-card" key={booking.id}>
                    <span>{t(`bookingTypes.${booking.type}`)}</span>
                    <strong>{booking.title}</strong>
                    {booking.confirmationCode ? (
                      <p>
                        {t("tripDetail.confirmationCode")}:{" "}
                        {booking.confirmationCode}
                      </p>
                    ) : null}
                    <CopyButton icon="ticket" text={booking.confirmationCode}>
                      {t("tripDetail.bookingActions.copyConfirmationCode")}
                    </CopyButton>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="data-section">
            <h2>{t("tripDetail.sections.checklist")}</h2>
            {selection.checklistItems.length === 0 ? (
              <EmptyState>{t("today.emptyChecklist")}</EmptyState>
            ) : (
              <div className="checklist-list">
                {selection.checklistItems.map((item) => (
                  <div className="checklist-row" key={item.id}>
                    <input checked={item.completed} readOnly type="checkbox" />
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}
