import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import {
  getPlaceCategoryLabelKey,
  placeCategories
} from "../places/placeCategories";
import { IconButton } from "../../shared/IconButton";
import { PlaceActions } from "../places/PlaceActions";
import { PlaceCategoryChip } from "../places/PlaceCategoryChip";
import type { PlaceFormValues } from "./types";

type PlaceCardProps = {
  place: Place;
  isEditing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  editPlaceForm?: PlaceFormValues;
  onStartEditing: (place: Place) => void;
  onDelete: (placeId: string) => Promise<void>;
  onMovePlace: (placeId: string, offset: -1 | 1) => Promise<void>;
  onEditFormChange: (placeId: string, patch: Partial<PlaceFormValues>) => void;
  onEdit: (event: FormEvent<HTMLFormElement>, place: Place) => Promise<void>;
  onCancelEditing: () => void;
};

export function PlaceCard({
  place,
  isEditing,
  canMoveUp,
  canMoveDown,
  editPlaceForm,
  onStartEditing,
  onDelete,
  onMovePlace,
  onEditFormChange,
  onEdit,
  onCancelEditing
}: PlaceCardProps) {
  const { t } = useTranslation();
  const formValues = editPlaceForm ?? {
    name: place.name,
    city: place.city ?? "",
    category: place.category ?? "other",
    nameZh: place.nameZh ?? "",
    address: place.address ?? "",
    addressZh: place.addressZh ?? "",
    lat: place.lat?.toString() ?? "",
    lng: place.lng?.toString() ?? "",
    amapPlaceId: place.amapPlaceId ?? "",
    amapUrl: place.amapUrl ?? "",
    notes: place.notes ?? ""
  };

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
                  category: event.target.value as PlaceFormValues["category"]
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
            <span>{t("tripDetail.placeForm.lat")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { lat: event.target.value })
              }
              step="any"
              type="number"
              value={formValues.lat}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.lng")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { lng: event.target.value })
              }
              step="any"
              type="number"
              value={formValues.lng}
            />
          </label>
          <label>
            <span>{t("tripDetail.placeForm.amapUrl")}</span>
            <input
              onChange={(event) =>
                onEditFormChange(place.id, { amapUrl: event.target.value })
              }
              type="url"
              value={formValues.amapUrl}
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
          <div className="item-heading-row">
            <strong>{place.name}</strong>
            <div className="reorder-actions">
              <IconButton
                disabled={!canMoveUp}
                icon="arrowUp"
                label={t("common.up")}
                onClick={() => void onMovePlace(place.id, -1)}
                type="button"
              />
              <IconButton
                disabled={!canMoveDown}
                icon="arrowDown"
                label={t("common.down")}
                onClick={() => void onMovePlace(place.id, 1)}
                type="button"
              />
            </div>
          </div>
          <PlaceCategoryChip category={place.category} />
          {place.nameZh ? <span>{place.nameZh}</span> : null}
          {place.addressZh ? <p>{place.addressZh}</p> : null}
          {place.address ? <p>{place.address}</p> : null}
          {place.notes ? <p>{place.notes}</p> : null}
          <PlaceActions place={place} />
          <div className="icon-button-row">
            <IconButton
              icon="edit"
              label={t("common.edit")}
              onClick={() => onStartEditing(place)}
              type="button"
            />
            <IconButton
              icon="trash"
              label={t("common.delete")}
              onClick={() => void onDelete(place.id)}
              type="button"
              variant="danger"
            />
          </div>
        </>
      )}
    </article>
  );
}
