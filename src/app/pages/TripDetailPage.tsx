import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { exportTripJsonPayload } from "../../db/repositories";
import { createTripExportFilename } from "../../export/tripJson";
import { BookingsSection } from "../../features/trip-detail/BookingsSection";
import { ChecklistSection } from "../../features/trip-detail/ChecklistSection";
import { DocumentsSection } from "../../features/trip-detail/DocumentsSection";
import { ExpensesSection } from "../../features/trip-detail/ExpensesSection";
import { ItinerarySection } from "../../features/trip-detail/ItinerarySection";
import { TripHeader } from "../../features/trip-detail/TripHeader";
import { useTripDetailData } from "../../features/trip-detail/useTripDetailData";

export function TripDetailPage() {
  const { tripId } = useParams();
  const { t } = useTranslation();
  const tripDetail = useTripDetailData(tripId);
  const [exportError, setExportError] = useState<string>();

  const handleExportTripJson = async () => {
    if (!tripDetail.trip) {
      return;
    }

    setExportError(undefined);

    try {
      const payload = await exportTripJsonPayload(tripDetail.trip.id);

      if (!payload) {
        setExportError(t("tripBackup.exportError"));
        return;
      }

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = createTripExportFilename(tripDetail.trip.title);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : t("tripBackup.exportError")
      );
    }
  };

  if (tripDetail.isLoading) {
    return <p className="muted-text">{t("common.loading")}</p>;
  }

  if (tripDetail.errorMessage) {
    return <p className="status-message">{tripDetail.errorMessage}</p>;
  }

  if (!tripDetail.trip) {
    return (
      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">{t("tripDetail.eyebrow")}</p>
          <h1>{t("tripDetail.notFoundTitle")}</h1>
          <p>{t("tripDetail.notFoundDescription")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <TripHeader trip={tripDetail.trip} />
      <div className="button-row">
        <button
          className="secondary-action"
          onClick={() => void handleExportTripJson()}
          type="button"
        >
          {t("tripBackup.exportButton")}
        </button>
      </div>
      {exportError ? <p className="status-message">{exportError}</p> : null}
      <ItinerarySection
        collapsedDayIds={tripDetail.collapsedDayIds}
        dayForm={tripDetail.dayForm}
        dayFormError={tripDetail.dayFormError}
        daysWithPlaces={tripDetail.daysWithPlaces}
        editPlaceForms={tripDetail.editPlaceForms}
        editingPlaceId={tripDetail.editingPlaceId}
        insertDayForms={tripDetail.insertDayForms}
        onAddDay={tripDetail.handleAddDay}
        onAddPlace={tripDetail.handleAddPlace}
        onCancelEditingPlace={tripDetail.cancelEditingPlace}
        onCollapseDays={tripDetail.collapseDays}
        onDayFormChange={tripDetail.updateDayForm}
        onDeleteDay={tripDetail.handleDeleteDay}
        onDeletePlace={tripDetail.handleDeletePlace}
        onEditPlace={tripDetail.handleEditPlace}
        onEditPlaceFormChange={tripDetail.updateEditPlaceForm}
        onExpandAllDays={tripDetail.expandAllDays}
        onInsertDayAfter={tripDetail.handleInsertDayAfter}
        onInsertDayFormChange={tripDetail.updateInsertDayForm}
        onMoveDay={tripDetail.handleMoveDay}
        onMovePlace={tripDetail.handleMovePlace}
        onPlaceFormChange={tripDetail.updatePlaceForm}
        onStartEditingPlace={tripDetail.startEditingPlace}
        onToggleDayCollapsed={tripDetail.toggleDayCollapsed}
        placeForms={tripDetail.placeForms}
      />
      <ExpensesSection
        days={tripDetail.daysWithPlaces.map(({ day }) => day)}
        editExpenseForms={tripDetail.editExpenseForms}
        editingExpenseId={tripDetail.editingExpenseId}
        expenseForm={tripDetail.expenseForm}
        expenses={tripDetail.expenses}
        onAddExpense={tripDetail.handleAddExpense}
        onCancelEditingExpense={tripDetail.cancelEditingExpense}
        onDeleteExpense={tripDetail.handleDeleteExpense}
        onEditExpense={tripDetail.handleEditExpense}
        onEditExpenseFormChange={tripDetail.updateEditExpenseForm}
        onExpenseFormChange={(patch) =>
          tripDetail.setExpenseForm((current) => ({ ...current, ...patch }))
        }
        onStartEditingExpense={tripDetail.startEditingExpense}
      />
      <BookingsSection
        bookingForm={tripDetail.bookingForm}
        bookings={tripDetail.bookings}
        editBookingForms={tripDetail.editBookingForms}
        editingBookingId={tripDetail.editingBookingId}
        onAddBooking={tripDetail.handleAddBooking}
        onBookingFormChange={(patch) =>
          tripDetail.setBookingForm((current) => ({ ...current, ...patch }))
        }
        onCancelEditingBooking={tripDetail.cancelEditingBooking}
        onDeleteBooking={tripDetail.handleDeleteBooking}
        onEditBooking={tripDetail.handleEditBooking}
        onEditBookingFormChange={tripDetail.updateEditBookingForm}
        onStartEditingBooking={tripDetail.startEditingBooking}
      />
      <DocumentsSection
        documentForm={tripDetail.documentForm}
        documents={tripDetail.documents}
        onAddDocument={tripDetail.handleAddDocument}
        onDeleteDocument={tripDetail.handleDeleteDocument}
        onDocumentFormChange={(patch) =>
          tripDetail.setDocumentForm((current) => ({ ...current, ...patch }))
        }
      />
      <ChecklistSection
        checklistForm={tripDetail.checklistForm}
        checklistItems={tripDetail.checklistItems}
        onAddChecklistItem={tripDetail.handleAddChecklistItem}
        onChecklistFormChange={(patch) =>
          tripDetail.setChecklistForm((current) => ({ ...current, ...patch }))
        }
        onDeleteChecklistItem={tripDetail.handleDeleteChecklistItem}
        onToggleChecklistItem={tripDetail.handleToggleChecklistItem}
      />
    </section>
  );
}
