import { useTranslation } from "react-i18next";

import type { Place } from "../../db/database";
import { buildAmapSearchUrl } from "../../maps/amapLinks";
import { CopyButton } from "../../shared/CopyButton";
import { IconLink } from "../../shared/IconButton";

type PlaceActionsProps = {
  place: Place;
};

export function PlaceActions({ place }: PlaceActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="place-actions">
      <CopyButton icon="text" text={place.nameZh}>
        {t("placeActions.copyChineseName")}
      </CopyButton>
      <CopyButton icon="mapPin" text={place.addressZh}>
        {t("placeActions.copyChineseAddress")}
      </CopyButton>
      <IconLink
        href={buildAmapSearchUrl(place)}
        icon="external"
        label={t("placeActions.openInAmap")}
        rel="noreferrer"
        target="_blank"
      />
    </div>
  );
}
