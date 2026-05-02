import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function TripDetailPage() {
  const { tripId } = useParams();
  const { t } = useTranslation();

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
        <h1>{tripId ?? t("tripDetail.fallbackTitle")}</h1>
      </div>
      <div className="timeline-list">
        <article>
          <span>{t("tripDetail.dayOne")}</span>
          <strong>{t("tripDetail.arrivalTitle")}</strong>
          <p>{t("tripDetail.arrivalDescription")}</p>
        </article>
        <article>
          <span>{t("tripDetail.places")}</span>
          <strong>{t("tripDetail.placesTitle")}</strong>
          <p>{t("tripDetail.placesDescription")}</p>
        </article>
      </div>
    </section>
  );
}
