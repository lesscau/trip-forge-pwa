import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Place, PlaceCategory, Trip, TripDay } from "../../db/database";
import {
  getTrip,
  listDaysByTrip,
  listPlacesByTrip,
  upsertPlace
} from "../../db/repositories";
import {
  getPlaceCategoryLabelKey,
  normalizePlaceCategory,
  placeCategories
} from "../../features/places/placeCategories";
import {
  filterPlaces,
  getPlaceDayLabel,
  groupPlaces,
  placeGroupKeys,
  type PlaceFilters,
  type PlaceGroupBy
} from "../../features/places/tripPlaces";
import { TripHeader } from "../../features/trip-detail/TripHeader";

type TripPlacesState = {
  trip?: Trip;
  days: TripDay[];
  places: Place[];
  isLoading: boolean;
  errorMessage?: string;
};

type TripPlacesPlaceForm = {
  name: string;
  dayId: string;
  city: string;
  category: PlaceCategory;
  nameZh: string;
  address: string;
  addressZh: string;
  notes: string;
};

const defaultFilters: PlaceFilters = {
  search: "",
  city: "",
  category: "",
  dayId: ""
};

export function TripPlacesPage() {
  const { tripId } = useParams();
  const { t } = useTranslation();
  const [state, setState] = useState<TripPlacesState>({
    days: [],
    places: [],
    isLoading: true
  });
  const [filters, setFilters] = useState<PlaceFilters>(defaultFilters);
  const [groupBy, setGroupBy] = useState<PlaceGroupBy>("city");
  const [editingPlaceId, setEditingPlaceId] = useState<string>();
  const [editPlaceForms, setEditPlaceForms] = useState<
    Record<string, TripPlacesPlaceForm>
  >({});
  const [saveError, setSaveError] = useState<string>();

  useEffect(() => {
    let isMounted = true;

    async function loadTripPlaces() {
      if (!tripId) {
        setState({
          days: [],
          places: [],
          isLoading: false,
          errorMessage: t("tripDetail.missingTripId")
        });
        return;
      }

      setState((current) => ({ ...current, isLoading: true, errorMessage: undefined }));

      try {
        const trip = await getTrip(tripId);

        if (!trip) {
          if (isMounted) {
            setState({ trip, days: [], places: [], isLoading: false });
          }
          return;
        }

        const [days, places] = await Promise.all([
          listDaysByTrip(tripId),
          listPlacesByTrip(tripId)
        ]);

        if (isMounted) {
          setState({ trip, days, places, isLoading: false });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            days: [],
            places: [],
            isLoading: false,
            errorMessage:
              error instanceof Error ? error.message : t("tripPlaces.loadError")
          });
        }
      }
    }

    void loadTripPlaces();

    return () => {
      isMounted = false;
    };
  }, [tripId, t]);

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          state.places
            .map((place) => place.city?.trim())
            .filter((city): city is string => Boolean(city))
        )
      ).sort((left, right) => left.localeCompare(right)),
    [state.places]
  );

  const filteredPlaces = useMemo(
    () => filterPlaces(state.places, filters),
    [filters, state.places]
  );

  const groupedPlaces = useMemo(
    () => groupPlaces(filteredPlaces, groupBy),
    [filteredPlaces, groupBy]
  );

  const startEditingPlace = (place: Place) => {
    setSaveError(undefined);
    setEditingPlaceId(place.id);
    setEditPlaceForms((current) => ({
      ...current,
      [place.id]: createPlaceForm(place)
    }));
  };

  const updateEditPlaceForm = (
    placeId: string,
    patch: Partial<TripPlacesPlaceForm>
  ) => {
    setEditPlaceForms((current) => ({
      ...current,
      [placeId]: {
        ...(current[placeId] ?? createPlaceForm()),
        ...patch
      }
    }));
  };

  const cancelEditingPlace = () => {
    setEditingPlaceId(undefined);
    setSaveError(undefined);
  };

  const handleEditPlace = async (
    event: FormEvent<HTMLFormElement>,
    place: Place
  ) => {
    event.preventDefault();

    const form = editPlaceForms[place.id] ?? createPlaceForm(place);
    const name = form.name.trim();

    if (!name) {
      return;
    }

    const nextPlace: Place = {
      ...place,
      name,
      dayId: form.dayId || undefined,
      city: form.city.trim() || undefined,
      category: normalizePlaceCategory(form.category),
      nameZh: form.nameZh.trim() || undefined,
      address: form.address.trim() || undefined,
      addressZh: form.addressZh.trim() || undefined,
      notes: form.notes.trim() || undefined
    };

    try {
      const savedPlace = await upsertPlace(nextPlace);
      setState((current) => ({
        ...current,
        places: current.places.map((currentPlace) =>
          currentPlace.id === savedPlace.id ? savedPlace : currentPlace
        )
      }));
      setEditingPlaceId(undefined);
      setSaveError(undefined);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : t("tripPlaces.saveError")
      );
    }
  };

  if (state.isLoading) {
    return <p className="muted-text">{t("common.loading")}</p>;
  }

  if (state.errorMessage) {
    return <p className="status-message">{state.errorMessage}</p>;
  }

  if (!state.trip) {
    return (
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">{t("tripPlaces.eyebrow")}</p>
          <h1>{t("tripDetail.notFoundTitle")}</h1>
          <p>{t("tripDetail.notFoundDescription")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <TripHeader trip={state.trip} />
      <div className="button-row">
        <Link className="secondary-action" to={`/trips/${state.trip.id}`}>
          {t("tripPlaces.backToTrip")}
        </Link>
      </div>

      <section className="data-section" aria-labelledby="trip-places-title">
        <div className="section-title-row">
          <h2 id="trip-places-title">{t("tripPlaces.title")}</h2>
          <span className="muted-text">
            {t("tripPlaces.count", { count: filteredPlaces.length })}
          </span>
        </div>
        {saveError ? <p className="status-message">{saveError}</p> : null}

        <div className="places-filter-panel">
          <label>
            <span>{t("tripPlaces.filters.search")}</span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value
                }))
              }
            />
          </label>

          <label>
            <span>{t("tripPlaces.filters.city")}</span>
            <select
              value={filters.city}
              onChange={(event) =>
                setFilters((current) => ({ ...current, city: event.target.value }))
              }
            >
              <option value="">{t("tripPlaces.filters.allCities")}</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t("tripPlaces.filters.category")}</span>
            <select
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  category: event.target.value as PlaceCategory | ""
                }))
              }
            >
              <option value="">{t("tripPlaces.filters.allCategories")}</option>
              {placeCategories.map((category) => (
                <option key={category} value={category}>
                  {t(getPlaceCategoryLabelKey(category))}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t("tripPlaces.filters.day")}</span>
            <select
              value={filters.dayId}
              onChange={(event) =>
                setFilters((current) => ({ ...current, dayId: event.target.value }))
              }
            >
              <option value="">{t("tripPlaces.filters.allDays")}</option>
              {state.days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.date} · {day.city}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t("tripPlaces.filters.groupBy")}</span>
            <select
              value={groupBy}
              onChange={(event) => setGroupBy(event.target.value as PlaceGroupBy)}
            >
              <option value="city">{t("tripPlaces.groupBy.city")}</option>
              <option value="category">{t("tripPlaces.groupBy.category")}</option>
              <option value="none">{t("tripPlaces.groupBy.none")}</option>
            </select>
          </label>

          <button
            className="secondary-action"
            onClick={() => setFilters(defaultFilters)}
            type="button"
          >
            {t("tripPlaces.filters.reset")}
          </button>
        </div>

        {state.places.length === 0 ? (
          <p className="muted-text">{t("tripDetail.emptyPlaces")}</p>
        ) : filteredPlaces.length === 0 ? (
          <p className="muted-text">{t("tripPlaces.emptyFiltered")}</p>
        ) : (
          <div className="places-group-list">
            {groupedPlaces.map((group) => (
              <section className="places-group" key={group.key}>
                {groupBy !== "none" ? (
                  <h3>{getGroupLabel(group.key, groupBy, t)}</h3>
                ) : null}
                <div className="day-place-list">
                  {group.places.map((place) => (
                    <PlaceListCard
                      days={state.days}
                      editPlaceForm={editPlaceForms[place.id]}
                      isEditing={editingPlaceId === place.id}
                      key={place.id}
                      onCancelEditing={cancelEditingPlace}
                      onEdit={handleEditPlace}
                      onEditFormChange={updateEditPlaceForm}
                      onStartEditing={startEditingPlace}
                      place={place}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function createPlaceForm(place?: Place): TripPlacesPlaceForm {
  return {
    name: place?.name ?? "",
    dayId: place?.dayId ?? "",
    city: place?.city ?? "",
    category: place?.category ?? "other",
    nameZh: place?.nameZh ?? "",
    address: place?.address ?? "",
    addressZh: place?.addressZh ?? "",
    notes: place?.notes ?? ""
  };
}

function getGroupLabel(
  key: string,
  groupBy: PlaceGroupBy,
  t: ReturnType<typeof useTranslation>["t"]
): string {
  if (groupBy === "city") {
    return key === placeGroupKeys.emptyCity
      ? t("tripPlaces.unknownCity")
      : key;
  }

  return t(getPlaceCategoryLabelKey(key as PlaceCategory));
}

function PlaceListCard({
  days,
  editPlaceForm,
  isEditing,
  onCancelEditing,
  onEdit,
  onEditFormChange,
  onStartEditing,
  place
}: {
  days: TripDay[];
  editPlaceForm?: TripPlacesPlaceForm;
  isEditing: boolean;
  onCancelEditing: () => void;
  onEdit: (event: FormEvent<HTMLFormElement>, place: Place) => Promise<void>;
  onEditFormChange: (
    placeId: string,
    patch: Partial<TripPlacesPlaceForm>
  ) => void;
  onStartEditing: (place: Place) => void;
  place: Place;
}) {
  const { t } = useTranslation();
  const dayLabel = getPlaceDayLabel(place, days);
  const formValues = editPlaceForm ?? createPlaceForm(place);

  return (
    <article className="day-place-card">
      {isEditing ? (
        <form
          className="compact-form embedded-form"
          onSubmit={(event) => void onEdit(event, place)}
        >
          <label>
            <span>{t("tripDetail.placeForm.name")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { name: event.target.value })
              }
              required
              type="text"
              value={formValues.name}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.dayId")}</span>
            <select
              onChange={(event) =>
                onEditFormChange(place.id, { dayId: event.target.value })
              }
              value={formValues.dayId}
            >
              <option value="">{t("tripDetail.placeForm.noDay")}</option>
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.date} · {day.city}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("tripDetail.dayForm.city")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { city: event.target.value })
              }
              type="text"
              value={formValues.city}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.category")}</span>
            <select
              onChange={(event) =>
                onEditFormChange(place.id, {
                  category: event.target.value as PlaceCategory
                })
              }
              value={formValues.category}
            >
              {placeCategories.map((category) => (
                <option key={category} value={category}>
                  {t(getPlaceCategoryLabelKey(category))}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("tripDetail.placeForm.nameZh")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { nameZh: event.target.value })
              }
              type="text"
              value={formValues.nameZh}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.address")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { address: event.target.value })
              }
              type="text"
              value={formValues.address}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.addressZh")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { addressZh: event.target.value })
              }
              type="text"
              value={formValues.addressZh}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.notes")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { notes: event.target.value })
              }
              type="text"
              value={formValues.notes}
            />
          </label>
          <div className="button-row">
            <button className="secondary-action" type="submit">
              {t("common.save")}
            </button>
            <button
              className="secondary-action"
              onClick={onCancelEditing}
              type="button"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="place-card-heading">
            <strong>{place.name}</strong>
            <span>{t(getPlaceCategoryLabelKey(place.category ?? "other"))}</span>
          </div>
          {place.nameZh ? <span>{place.nameZh}</span> : null}
          {place.city ? <p>{place.city}</p> : null}
          {place.address ? <p>{place.address}</p> : null}
          {place.addressZh ? <p>{place.addressZh}</p> : null}
          {place.notes ? <p>{place.notes}</p> : null}
          {dayLabel ? (
            <p>
              {t("tripPlaces.dayLabel")}: {dayLabel}
            </p>
          ) : null}
          <div className="button-row">
            <button
              className="secondary-action"
              onClick={() => onStartEditing(place)}
              type="button"
            >
              {t("common.edit")}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
