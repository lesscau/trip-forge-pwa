import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { BookingsSection } from "../../features/trip-detail/BookingsSection";
import { ChecklistSection } from "../../features/trip-detail/ChecklistSection";
import { ItinerarySection } from "../../features/trip-detail/ItinerarySection";
import { TripHeader } from "../../features/trip-detail/TripHeader";
import { useTripDetailData } from "../../features/trip-detail/useTripDetailData";

export function TripDetailPage() {
  const { tripId } = useParams();
  const { t } = useTranslation();
  const tripDetail = useTripDetailData(tripId);

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
      <BookingsSection bookings={tripDetail.bookings} />
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
