import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">{t("home.eyebrow")}</p>
        <h1>{t("home.title")}</h1>
        <p>{t("home.description")}</p>
        <div className="button-row">
          <Link className="primary-action" to="/today">
            {t("home.openToday")}
          </Link>
          <Link className="secondary-action" to="/trips">
            {t("home.viewTrips")}
          </Link>
        </div>
      </div>
      <div className="status-panel" aria-label={t("home.statusAria")}>
        <span>{t("home.offlineReady")}</span>
        <strong>{t("home.indexedDbFirst")}</strong>
        <p>{t("home.backupNote")}</p>
      </div>
    </section>
  );
}
