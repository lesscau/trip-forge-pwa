import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Booking, ChecklistItem, Place, Trip } from "../../db/database";
import {
  getTrip,
  listBookingsByTrip,
  listChecklistItemsByTrip,
  listDaysByTrip,
  listPlacesByTrip,
  upsertChecklistItem
} from "../../db/repositories";
import { formatDate, formatTripDateRange } from "../../shared/format";
import { groupPlacesByDay, type DayWithPlaces } from "../tripDetailData";

export function TripDetailPage() {
  const { tripId } = useParams();
  const { i18n, t } = useTranslation();
  const [trip, setTrip] = useState<Trip>();
  const [daysWithPlaces, setDaysWithPlaces] = useState<DayWithPlaces[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const loadTrip = useCallback(async () => {
    if (!tripId) {
      setErrorMessage(t("tripDetail.missingTripId"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const loadedTrip = await getTrip(tripId);

      if (!loadedTrip) {
        setTrip(undefined);
        return;
      }

      const [loadedDays, loadedPlaces, loadedBookings, loadedChecklistItems] =
        await Promise.all([
          listDaysByTrip(tripId),
          listPlacesByTrip(tripId),
          listBookingsByTrip(tripId),
          listChecklistItemsByTrip(tripId)
        ]);

      setTrip(loadedTrip);
      setDaysWithPlaces(groupPlacesByDay(loadedDays, loadedPlaces));
      setPlaces(loadedPlaces);
      setBookings(loadedBookings);
      setChecklistItems(loadedChecklistItems);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("tripDetail.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  }, [tripId, t]);

  useEffect(() => {
    void loadTrip();
  }, [loadTrip]);

  const handleToggleChecklistItem = async (item: ChecklistItem) => {
    const updatedItem = {
      ...item,
      completed: !item.completed
    };

    await upsertChecklistItem(updatedItem);
    setChecklistItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id ? updatedItem : currentItem
      )
    );
  };

  if (isLoading) {
    return <p className="muted-text">{t("common.loading")}</p>;
  }

  if (errorMessage) {
    return <p className="status-message">{errorMessage}</p>;
  }

  if (!trip) {
    return (
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
          <h1>{t("tripDetail.notFoundTitle")}</h1>
          <p>{t("tripDetail.notFoundDescription")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
        <h1>{trip.title}</h1>
        <p>
          {trip.destinationCountry} ·{" "}
          {formatTripDateRange(trip.startDate, trip.endDate, i18n.language)}
        </p>
      </div>

      <section className="data-section">
        <h2>{t("tripDetail.sections.itinerary")}</h2>
        {daysWithPlaces.length === 0 ? (
          <p className="muted-text">{t("tripDetail.emptyDays")}</p>
        ) : (
          <div className="timeline-list">
            {daysWithPlaces.map(({ day, places: dayPlaces }) => (
              <article key={day.id}>
                <span>{formatDate(day.date, i18n.language)}</span>
                <strong>{day.city}</strong>
                {day.summary ? <p>{day.summary}</p> : null}
                {dayPlaces.length > 0 ? (
                  <ul className="inline-list">
                    {dayPlaces.map((place) => (
                      <li key={place.id}>
                        {place.nameZh ? `${place.name} · ${place.nameZh}` : place.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted-text">{t("tripDetail.emptyDayPlaces")}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="data-section">
        <h2>{t("tripDetail.sections.places")}</h2>
        {places.length === 0 ? (
          <p className="muted-text">{t("tripDetail.emptyPlaces")}</p>
        ) : (
          <div className="card-grid">
            {places.map((place) => (
              <article className="focus-card" key={place.id}>
                <span>{place.nameZh ?? t("tripDetail.place")}</span>
                <strong>{place.name}</strong>
                {place.addressZh ? <p>{place.addressZh}</p> : null}
                {place.notes ? <p>{place.notes}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="data-section">
        <h2>{t("tripDetail.sections.bookings")}</h2>
        {bookings.length === 0 ? (
          <p className="muted-text">{t("tripDetail.emptyBookings")}</p>
        ) : (
          <div className="card-grid">
            {bookings.map((booking) => (
              <article className="focus-card" key={booking.id}>
                <span>{t(`bookingTypes.${booking.type}`)}</span>
                <strong>{booking.title}</strong>
                {booking.confirmationCode ? (
                  <p>
                    {t("tripDetail.confirmationCode")}:{" "}
                    {booking.confirmationCode}
                  </p>
                ) : null}
                {booking.startsAt ? (
                  <p>
                    {t("tripDetail.startsAt")}: {booking.startsAt}
                  </p>
                ) : null}
                {booking.endsAt ? (
                  <p>
                    {t("tripDetail.endsAt")}: {booking.endsAt}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="data-section">
        <h2>{t("tripDetail.sections.checklist")}</h2>
        {checklistItems.length === 0 ? (
          <p className="muted-text">{t("tripDetail.emptyChecklist")}</p>
        ) : (
          <div className="checklist-list">
            {checklistItems.map((item) => (
              <label className="checklist-row" key={item.id}>
                <input
                  checked={item.completed}
                  onChange={() => void handleToggleChecklistItem(item)}
                  type="checkbox"
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
