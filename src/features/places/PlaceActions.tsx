import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import { buildAmapSearchUrl } from "../../maps/amapLinks";
import { CopyButton } from "../../shared/CopyButton";

type PlaceActionsProps = {
  place: Place;
};

export function PlaceActions({ place }: PlaceActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="place-actions">
      <CopyButton text={place.nameZh}>
        {t("placeActions.copyChineseName")}
      </CopyButton>
      <CopyButton text={place.addressZh}>
        {t("placeActions.copyChineseAddress")}
      </CopyButton>
      <a
        className="secondary-action"
        href={buildAmapSearchUrl(place)}
        rel="noreferrer"
        target="_blank"
      >
        {t("placeActions.openInAmap")}
      </a>
    </div>
  );
}
