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

type PlaceFormValues = {
  name: string;
  nameZh: string;
  address: string;
  addressZh: string;
  notes: string;
};

const EMPTY_PLACE_FORM: PlaceFormValues = {
  name: "",
  nameZh: "",
  address: "",
  addressZh: "",
  notes: ""
};

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
  const [placeForms, setPlaceForms] = useState<Record<string, PlaceFormValues>>(
    {}
  );
  const [editingPlaceId, setEditingPlaceId] = useState<string>();
  const [editPlaceForms, setEditPlaceForms] = useState<
    Record<string, PlaceFormValues>
  >({});
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

  const updatePlaceForm = (
    dayId: string,
    patch: Partial<PlaceFormValues>
  ) => {
    setPlaceForms((current) => ({
      ...current,
      [dayId]: {
        ...EMPTY_PLACE_FORM,
        ...current[dayId],
        ...patch
      }
    }));
  };

  const handleAddPlace = async (
    event: FormEvent<HTMLFormElement>,
    dayId: string
  ) => {
    event.preventDefault();

    if (!trip) {
      return;
    }

    const placeForm = placeForms[dayId] ?? EMPTY_PLACE_FORM;

    await upsertPlace({
      id: crypto.randomUUID(),
      tripId: trip.id,
      dayId,
      name: placeForm.name,
      nameZh: placeForm.nameZh || undefined,
      address: placeForm.address || undefined,
      addressZh: placeForm.addressZh || undefined,
      notes: placeForm.notes || undefined,
      orderIndex: getNextOrderIndex(places)
    });
    setPlaceForms((current) => ({
      ...current,
      [dayId]: EMPTY_PLACE_FORM
    }));
    await loadTrip();
  };

  const handleDeletePlace = async (placeId: string) => {
    await deletePlace(placeId);
    await loadTrip();
  };

  const startEditingPlace = (place: Place) => {
    setEditingPlaceId(place.id);
    setEditPlaceForms((current) => ({
      ...current,
      [place.id]: {
        name: place.name,
        nameZh: place.nameZh ?? "",
        address: place.address ?? "",
        addressZh: place.addressZh ?? "",
        notes: place.notes ?? ""
      }
    }));
  };

  const updateEditPlaceForm = (
    placeId: string,
    patch: Partial<PlaceFormValues>
  ) => {
    setEditPlaceForms((current) => ({
      ...current,
      [placeId]: {
        ...EMPTY_PLACE_FORM,
        ...current[placeId],
        ...patch
      }
    }));
  };

  const cancelEditingPlace = () => {
    setEditingPlaceId(undefined);
  };

  const handleEditPlace = async (
    event: FormEvent<HTMLFormElement>,
    place: Place
  ) => {
    event.preventDefault();

    const placeForm = editPlaceForms[place.id] ?? {
      name: place.name,
      nameZh: place.nameZh ?? "",
      address: place.address ?? "",
      addressZh: place.addressZh ?? "",
      notes: place.notes ?? ""
    };

    await upsertPlace({
      ...place,
      name: placeForm.name,
      nameZh: placeForm.nameZh || undefined,
      address: placeForm.address || undefined,
      addressZh: placeForm.addressZh || undefined,
      notes: placeForm.notes || undefined
    });
    setEditingPlaceId(undefined);
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
                  <div className="day-place-list">
                    {dayPlaces.map((place) => (
                      <article className="day-place-card" key={place.id}>
                        {editingPlaceId === place.id ? (
                          <form
                            className="compact-form embedded-form"
                            onSubmit={(event) =>
                              void handleEditPlace(event, place)
                            }
                          >
                            <label>
                              <span>{t("tripDetail.placeForm.name")}</span>
                              <input
                                onChange={(event) =>
                                  updateEditPlaceForm(place.id, {
                                    name: event.target.value
                                  })
                                }
                                required
                                type="text"
                                value={
                                  editPlaceForms[place.id]?.name ?? place.name
                                }
                              />
                            </label>
                            <label>
                              <span>{t("tripDetail.placeForm.nameZh")}</span>
                              <input
                                onChange={(event) =>
                                  updateEditPlaceForm(place.id, {
                                    nameZh: event.target.value
                                  })
                                }
                                type="text"
                                value={
                                  editPlaceForms[place.id]?.nameZh ??
                                  place.nameZh ??
                                  ""
                                }
                              />
                            </label>
                            <label>
                              <span>{t("tripDetail.placeForm.address")}</span>
                              <input
                                onChange={(event) =>
                                  updateEditPlaceForm(place.id, {
                                    address: event.target.value
                                  })
                                }
                                type="text"
                                value={
                                  editPlaceForms[place.id]?.address ??
                                  place.address ??
                                  ""
                                }
                              />
                            </label>
                            <label>
                              <span>{t("tripDetail.placeForm.addressZh")}</span>
                              <input
                                onChange={(event) =>
                                  updateEditPlaceForm(place.id, {
                                    addressZh: event.target.value
                                  })
                                }
                                type="text"
                                value={
                                  editPlaceForms[place.id]?.addressZh ??
                                  place.addressZh ??
                                  ""
                                }
                              />
                            </label>
                            <label>
                              <span>{t("tripDetail.placeForm.notes")}</span>
                              <input
                                onChange={(event) =>
                                  updateEditPlaceForm(place.id, {
                                    notes: event.target.value
                                  })
                                }
                                type="text"
                                value={
                                  editPlaceForms[place.id]?.notes ??
                                  place.notes ??
                                  ""
                                }
                              />
                            </label>
                            <div className="button-row">
                              <button className="secondary-action" type="submit">
                                {t("common.save")}
                              </button>
                              <button
                                className="secondary-action"
                                onClick={cancelEditingPlace}
                                type="button"
                              >
                                {t("common.cancel")}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <strong>{place.name}</strong>
                            {place.nameZh ? <span>{place.nameZh}</span> : null}
                            {place.addressZh ? <p>{place.addressZh}</p> : null}
                            {place.address ? <p>{place.address}</p> : null}
                            {place.notes ? <p>{place.notes}</p> : null}
                            <div className="button-row">
                              <button
                                className="secondary-action"
                                onClick={() => startEditingPlace(place)}
                                type="button"
                              >
                                {t("common.edit")}
                              </button>
                              <button
                                className="danger-action"
                                onClick={() => void handleDeletePlace(place.id)}
                                type="button"
                              >
                                {t("common.delete")}
                              </button>
                            </div>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted-text">{t("tripDetail.emptyDayPlaces")}</p>
                )}
                <form
                  className="compact-form day-place-form"
                  onSubmit={(event) => void handleAddPlace(event, day.id)}
                >
                  <label>
                    <span>{t("tripDetail.placeForm.name")}</span>
                    <input
                      onChange={(event) =>
                        updatePlaceForm(day.id, { name: event.target.value })
                      }
                      required
                      type="text"
                      value={placeForms[day.id]?.name ?? ""}
                    />
                  </label>
                  <label>
                    <span>{t("tripDetail.placeForm.nameZh")}</span>
                    <input
                      onChange={(event) =>
                        updatePlaceForm(day.id, { nameZh: event.target.value })
                      }
                      type="text"
                      value={placeForms[day.id]?.nameZh ?? ""}
                    />
                  </label>
                  <label>
                    <span>{t("tripDetail.placeForm.address")}</span>
                    <input
                      onChange={(event) =>
                        updatePlaceForm(day.id, { address: event.target.value })
                      }
                      type="text"
                      value={placeForms[day.id]?.address ?? ""}
                    />
                  </label>
                  <label>
                    <span>{t("tripDetail.placeForm.addressZh")}</span>
                    <input
                      onChange={(event) =>
                        updatePlaceForm(day.id, {
                          addressZh: event.target.value
                        })
                      }
                      type="text"
                      value={placeForms[day.id]?.addressZh ?? ""}
                    />
                  </label>
                  <label>
                    <span>{t("tripDetail.placeForm.notes")}</span>
                    <input
                      onChange={(event) =>
                        updatePlaceForm(day.id, { notes: event.target.value })
                      }
                      type="text"
                      value={placeForms[day.id]?.notes ?? ""}
                    />
                  </label>
                  <button className="secondary-action" type="submit">
                    {t("tripDetail.placeForm.submit")}
                  </button>
                </form>
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
