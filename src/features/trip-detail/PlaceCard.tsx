import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import {
  getPlaceCategoryLabelKey,
  placeCategories
} from "../places/placeCategories";
import { PlaceActions } from "../places/PlaceActions";
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
    category: place.category ?? "other",
    nameZh: place.nameZh ?? "",
    address: place.address ?? "",
    addressZh: place.addressZh ?? "",
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
              <button
                className="secondary-action"
                disabled={!canMoveUp}
                onClick={() => void onMovePlace(place.id, -1)}
                type="button"
              >
                {t("common.up")}
              </button>
              <button
                className="secondary-action"
                disabled={!canMoveDown}
                onClick={() => void onMovePlace(place.id, 1)}
                type="button"
              >
                {t("common.down")}
              </button>
            </div>
          </div>
          <span>{t(getPlaceCategoryLabelKey(place.category ?? "other"))}</span>
          {place.nameZh ? <span>{place.nameZh}</span> : null}
          {place.addressZh ? <p>{place.addressZh}</p> : null}
          {place.address ? <p>{place.address}</p> : null}
          {place.notes ? <p>{place.notes}</p> : null}
          <PlaceActions place={place} />
          <div className="button-row">
            <button
              className="secondary-action"
              onClick={() => onStartEditing(place)}
              type="button"
            >
              {t("common.edit")}
            </button>
            <button
              className="danger-action"
              onClick={() => void onDelete(place.id)}
              type="button"
            >
              {t("common.delete")}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
