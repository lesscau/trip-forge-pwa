import { useTranslation } from "react-i18next";

import type { BookingType, TravelDocumentType } from "../../db/database";

export function BookingTypeChip({ type }: { type: BookingType }) {
  const { t } = useTranslation();

  return (
    <span className={`type-chip type-chip-booking-${type}`}>
      {t(`bookingTypes.${type}`)}
    </span>
  );
}

export function TravelDocumentTypeChip({
  type
}: {
  type: TravelDocumentType;
}) {
  const { t } = useTranslation();

  return (
    <span className={`type-chip type-chip-document-${type}`}>
      {t(`travelDocumentTypes.${type}`)}
    </span>
  );
}
