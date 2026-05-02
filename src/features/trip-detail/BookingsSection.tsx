import { useTranslation } from "react-i18next";

import type { Booking } from "../../db/database";

type BookingsSectionProps = {
  bookings: Booking[];
};

export function BookingsSection({ bookings }: BookingsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="data-section">
      <h2>{t("tripDetail.sections.bookings")}</h2>
      {bookings.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyBookings")}</p>
      ) : (
        <div className="card-grid">
          {bookings.map((booking) => (
            <article className="focus-card" key={booking.id}>
              <span>{t(`bookingTypes.${booking.type}`)}</span>
              <strong>{booking.title}</strong>
              {booking.confirmationCode ? (
                <p>
                  {t("tripDetail.confirmationCode")}:{" "}
                  {booking.confirmationCode}
                </p>
              ) : null}
              {booking.startsAt ? (
                <p>
                  {t("tripDetail.startsAt")}: {booking.startsAt}
                </p>
              ) : null}
              {booking.endsAt ? (
                <p>
                  {t("tripDetail.endsAt")}: {booking.endsAt}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
