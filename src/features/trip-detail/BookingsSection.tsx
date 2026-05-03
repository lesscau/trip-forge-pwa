import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { Booking, BookingType } from "../../db/database";
import { CopyButton } from "../../shared/CopyButton";
import { IconButton } from "../../shared/IconButton";
import { SectionHeader } from "../../shared/SectionHeader";
import { BookingTypeChip } from "./TypeChip";
import type { BookingFormValues } from "./types";

const bookingTypes: BookingType[] = [
  "hotel",
  "train",
  "flight",
  "attraction",
  "other"
];

type BookingsSectionProps = {
  bookings: Booking[];
  bookingForm: BookingFormValues;
  editingBookingId?: string;
  editBookingForms: Record<string, BookingFormValues>;
  onBookingFormChange: (patch: Partial<BookingFormValues>) => void;
  onAddBooking: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onStartEditingBooking: (booking: Booking) => void;
  onEditBookingFormChange: (
    bookingId: string,
    patch: Partial<BookingFormValues>
  ) => void;
  onEditBooking: (
    event: FormEvent<HTMLFormElement>,
    booking: Booking
  ) => Promise<void>;
  onCancelEditingBooking: () => void;
};

export function BookingsSection({
  bookings,
  bookingForm,
  editingBookingId,
  editBookingForms,
  onBookingFormChange,
  onAddBooking,
  onDeleteBooking,
  onStartEditingBooking,
  onEditBookingFormChange,
  onEditBooking,
  onCancelEditingBooking
}: BookingsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="data-section">
      <SectionHeader icon="bookings" title={t("tripDetail.sections.bookings")} />
      <form
        className="compact-form"
        onSubmit={(event) => void onAddBooking(event)}
      >
        <label>
          <span>{t("tripDetail.bookingForm.type")}</span>
          <select
            onChange={(event) =>
              onBookingFormChange({ type: event.target.value as BookingType })
            }
            value={bookingForm.type}
          >
            {bookingTypes.map((type) => (
              <option key={type} value={type}>
                {t(`bookingTypes.${type}`)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.title")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ title: event.target.value })
            }
            required
            type="text"
            value={bookingForm.title}
          />
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.confirmationCode")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ confirmationCode: event.target.value })
            }
            type="text"
            value={bookingForm.confirmationCode}
          />
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.startsAt")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ startsAt: event.target.value })
            }
            type="datetime-local"
            value={bookingForm.startsAt}
          />
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.endsAt")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ endsAt: event.target.value })
            }
            type="datetime-local"
            value={bookingForm.endsAt}
          />
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.address")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ address: event.target.value })
            }
            type="text"
            value={bookingForm.address}
          />
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.addressZh")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ addressZh: event.target.value })
            }
            type="text"
            value={bookingForm.addressZh}
          />
        </label>
        <label>
          <span>{t("tripDetail.bookingForm.notes")}</span>
          <input
            onChange={(event) =>
              onBookingFormChange({ notes: event.target.value })
            }
            type="text"
            value={bookingForm.notes}
          />
        </label>
        <button className="secondary-action" type="submit">
          {t("tripDetail.bookingForm.submit")}
        </button>
      </form>
      {bookings.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyBookings")}</p>
      ) : (
        <div className="card-grid">
          {bookings.map((booking) => (
            <article className="focus-card" key={booking.id}>
              {editingBookingId === booking.id ? (
                <BookingForm
                  bookingForm={editBookingForms[booking.id]}
                  onBookingFormChange={(patch) =>
                    onEditBookingFormChange(booking.id, patch)
                  }
                  onCancel={onCancelEditingBooking}
                  onSubmit={(event) => void onEditBooking(event, booking)}
                  submitLabel={t("common.save")}
                />
              ) : (
                <>
                  <BookingTypeChip type={booking.type} />
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
                  {booking.address ? <p>{booking.address}</p> : null}
                  {booking.addressZh ? <p>{booking.addressZh}</p> : null}
                  {booking.notes ? <p>{booking.notes}</p> : null}
                  <div className="place-actions">
                    <CopyButton icon="ticket" text={booking.confirmationCode}>
                      {t("tripDetail.bookingActions.copyConfirmationCode")}
                    </CopyButton>
                    <CopyButton icon="mapPin" text={booking.addressZh}>
                      {t("tripDetail.bookingActions.copyChineseAddress")}
                    </CopyButton>
                  </div>
                  <div className="icon-button-row">
                    <IconButton
                      icon="edit"
                      label={t("common.edit")}
                      onClick={() => onStartEditingBooking(booking)}
                      type="button"
                    />
                    <IconButton
                      icon="trash"
                      label={t("common.delete")}
                      onClick={() => void onDeleteBooking(booking.id)}
                      type="button"
                      variant="danger"
                    />
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BookingForm({
  bookingForm,
  onBookingFormChange,
  onSubmit,
  submitLabel,
  onCancel
}: {
  bookingForm: BookingFormValues;
  onBookingFormChange: (patch: Partial<BookingFormValues>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <form className="compact-form embedded-form" onSubmit={onSubmit}>
      <label>
        <span>{t("tripDetail.bookingForm.type")}</span>
        <select
          onChange={(event) =>
            onBookingFormChange({ type: event.target.value as BookingType })
          }
          value={bookingForm.type}
        >
          {bookingTypes.map((type) => (
            <option key={type} value={type}>
              {t(`bookingTypes.${type}`)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.title")}</span>
        <input
          onChange={(event) =>
            onBookingFormChange({ title: event.target.value })
          }
          required
          type="text"
          value={bookingForm.title}
        />
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.confirmationCode")}</span>
        <input
          onChange={(event) =>
            onBookingFormChange({ confirmationCode: event.target.value })
          }
          type="text"
          value={bookingForm.confirmationCode}
        />
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.startsAt")}</span>
        <input
          onChange={(event) =>
            onBookingFormChange({ startsAt: event.target.value })
          }
          type="datetime-local"
          value={bookingForm.startsAt}
        />
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.endsAt")}</span>
        <input
          onChange={(event) =>
            onBookingFormChange({ endsAt: event.target.value })
          }
          type="datetime-local"
          value={bookingForm.endsAt}
        />
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.address")}</span>
        <input
          onChange={(event) =>
            onBookingFormChange({ address: event.target.value })
          }
          type="text"
          value={bookingForm.address}
        />
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.addressZh")}</span>
        <input
          onChange={(event) =>
            onBookingFormChange({ addressZh: event.target.value })
          }
          type="text"
          value={bookingForm.addressZh}
        />
      </label>
      <label>
        <span>{t("tripDetail.bookingForm.notes")}</span>
        <input
          onChange={(event) => onBookingFormChange({ notes: event.target.value })}
          type="text"
          value={bookingForm.notes}
        />
      </label>
      <div className="button-row">
        <button className="secondary-action" type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="secondary-action" onClick={onCancel} type="button">
            {t("common.cancel")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
