import { useTranslation } from "react-i18next";

export function TodayPage() {
  const { t } = useTranslation();

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("today.eyebrow")}</p>
        <h1>{t("today.title")}</h1>
      </div>
      <div className="today-layout">
        <article className="focus-card">
          <span>{t("today.nextStop")}</span>
          <strong>{t("today.checkInTitle")}</strong>
          <p>{t("today.checkInDescription")}</p>
        </article>
        <article className="focus-card">
          <span>{t("today.backup")}</span>
          <strong>{t("today.exportJson")}</strong>
          <p>{t("today.backupDescription")}</p>
        </article>
      </div>
    </section>
  );
}
