import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Booking, ChecklistItem, Place, Trip } from "../../db/database";
import {
  deleteChecklistItem,
  deleteDay,
  deletePlace,
  getTrip,
  listBookingsByTrip,
  listChecklistItemsByTrip,
  listDaysByTrip,
  listPlacesByTrip,
  upsertDay,
  upsertChecklistItem,
  upsertPlace
} from "../../db/repositories";
import { formatDate, formatTripDateRange } from "../../shared/format";
import { getNextOrderIndex } from "../../shared/ordering";
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
  const [dayForm, setDayForm] = useState({
    date: "",
    city: "",
    summary: ""
  });
  const [placeForm, setPlaceForm] = useState({
    dayId: "",
    name: "",
    nameZh: "",
    address: "",
    addressZh: "",
    notes: ""
  });
  const [checklistForm, setChecklistForm] = useState({
    title: "",
    category: ""
  });

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

  const handleAddDay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    await upsertDay({
      id: crypto.randomUUID(),
      tripId: trip.id,
      date: dayForm.date,
      city: dayForm.city,
      summary: dayForm.summary || undefined,
      orderIndex: getNextOrderIndex(daysWithPlaces.map(({ day }) => day))
    });
    setDayForm({ date: "", city: "", summary: "" });
    await loadTrip();
  };

  const handleDeleteDay = async (dayId: string) => {
    await deleteDay(dayId);
    await loadTrip();
  };

  const handleAddPlace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    await upsertPlace({
      id: crypto.randomUUID(),
      tripId: trip.id,
      dayId: placeForm.dayId || undefined,
      name: placeForm.name,
      nameZh: placeForm.nameZh || undefined,
      address: placeForm.address || undefined,
      addressZh: placeForm.addressZh || undefined,
      notes: placeForm.notes || undefined,
      orderIndex: getNextOrderIndex(places)
    });
    setPlaceForm({
      dayId: "",
      name: "",
      nameZh: "",
      address: "",
      addressZh: "",
      notes: ""
    });
    await loadTrip();
  };

  const handleDeletePlace = async (placeId: string) => {
    await deletePlace(placeId);
    await loadTrip();
  };

  const handleAddChecklistItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    await upsertChecklistItem({
      id: crypto.randomUUID(),
      tripId: trip.id,
      title: checklistForm.title,
      category: checklistForm.category || undefined,
      completed: false,
      orderIndex: getNextOrderIndex(checklistItems)
    });
    setChecklistForm({ title: "", category: "" });
    await loadTrip();
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    await deleteChecklistItem(itemId);
    await loadTrip();
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
          {trip.destinationCountry}{" - "}
          {formatTripDateRange(trip.startDate, trip.endDate, i18n.language)}
        </p>
      </div>

      <section className="data-section">
        <h2>{t("tripDetail.sections.itinerary")}</h2>
        <form
          className="compact-form"
          onSubmit={(event) => void handleAddDay(event)}
        >
          <label>
            <span>{t("tripDetail.dayForm.date")}</span>
            <input
              onChange={(event) =>
                setDayForm((current) => ({
                  ...current,
                  date: event.target.value
                }))
              }
              required
              type="date"
              value={dayForm.date}
            />
          </label>
          <label>
            <span>{t("tripDetail.dayForm.city")}</span>
            <input
              onChange={(event) =>
                setDayForm((current) => ({
                  ...current,
                  city: event.target.value
                }))
              }
              required
              type="text"
              value={dayForm.city}
            />
          </label>
          <label>
            <span>{t("tripDetail.dayForm.summary")}</span>
            <input
              onChange={(event) =>
                setDayForm((current) => ({
                  ...current,
                  summary: event.target.value
                }))
              }
              type="text"
              value={dayForm.summary}
            />
          </label>
          <button className="secondary-action" type="submit">
            {t("tripDetail.dayForm.submit")}
          </button>
        </form>
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
                        {place.nameZh
                          ? `${place.name} - ${place.nameZh}`
                          : place.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted-text">{t("tripDetail.emptyDayPlaces")}</p>
                )}
                <button
                  className="danger-action"
                  onClick={() => void handleDeleteDay(day.id)}
                  type="button"
                >
                  {t("common.delete")}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="data-section">
        <h2>{t("tripDetail.sections.places")}</h2>
        <form
          className="compact-form"
          onSubmit={(event) => void handleAddPlace(event)}
        >
          <label>
            <span>{t("tripDetail.placeForm.dayId")}</span>
            <select
              onChange={(event) =>
                setPlaceForm((current) => ({
                  ...current,
                  dayId: event.target.value
                }))
              }
              value={placeForm.dayId}
            >
              <option value="">{t("tripDetail.placeForm.noDay")}</option>
              {daysWithPlaces.map(({ day }) => (
                <option key={day.id} value={day.id}>
                  {day.city} - {day.date}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("tripDetail.placeForm.name")}</span>
            <input
              onChange={(event) =>
                setPlaceForm((current) => ({
                  ...current,
                  name: event.target.value
                }))
              }
              required
              type="text"
              value={placeForm.name}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.nameZh")}</span>
            <input
              onChange={(event) =>
                setPlaceForm((current) => ({
                  ...current,
                  nameZh: event.target.value
                }))
              }
              type="text"
              value={placeForm.nameZh}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.address")}</span>
            <input
              onChange={(event) =>
                setPlaceForm((current) => ({
                  ...current,
                  address: event.target.value
                }))
              }
              type="text"
              value={placeForm.address}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.addressZh")}</span>
            <input
              onChange={(event) =>
                setPlaceForm((current) => ({
                  ...current,
                  addressZh: event.target.value
                }))
              }
              type="text"
              value={placeForm.addressZh}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.notes")}</span>
            <input
              onChange={(event) =>
                setPlaceForm((current) => ({
                  ...current,
                  notes: event.target.value
                }))
              }
              type="text"
              value={placeForm.notes}
            />
          </label>
          <button className="secondary-action" type="submit">
            {t("tripDetail.placeForm.submit")}
          </button>
        </form>
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
                <button
                  className="danger-action"
                  onClick={() => void handleDeletePlace(place.id)}
                  type="button"
                >
                  {t("common.delete")}
                </button>
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
        <form
          className="compact-form"
          onSubmit={(event) => void handleAddChecklistItem(event)}
        >
          <label>
            <span>{t("tripDetail.checklistForm.title")}</span>
            <input
              onChange={(event) =>
                setChecklistForm((current) => ({
                  ...current,
                  title: event.target.value
                }))
              }
              required
              type="text"
              value={checklistForm.title}
            />
          </label>
          <label>
            <span>{t("tripDetail.checklistForm.category")}</span>
            <input
              onChange={(event) =>
                setChecklistForm((current) => ({
                  ...current,
                  category: event.target.value
                }))
              }
              type="text"
              value={checklistForm.category}
            />
          </label>
          <button className="secondary-action" type="submit">
            {t("tripDetail.checklistForm.submit")}
          </button>
        </form>
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
                <button
                  className="danger-action"
                  onClick={() => void handleDeleteChecklistItem(item.id)}
                  type="button"
                >
                  {t("common.delete")}
                </button>
              </label>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
