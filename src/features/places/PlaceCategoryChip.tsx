import { useTranslation } from "react-i18next";

import type { PlaceCategory } from "../../db/database";
import { getPlaceCategoryLabelKey } from "./placeCategories";

type PlaceCategoryChipProps = {
  category?: PlaceCategory;
};

export function PlaceCategoryChip({ category = "other" }: PlaceCategoryChipProps) {
  const { t } = useTranslation();

  return (
    <span className={`category-chip category-chip-${category}`}>
      {t(getPlaceCategoryLabelKey(category))}
    </span>
  );
}
