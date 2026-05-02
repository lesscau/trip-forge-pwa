import type { Booking, ChecklistItem, Place, Trip, TripDay } from "../db/database";

export type TodaySelectionInput = {
  trips: Trip[];
  days: TripDay[];
  places: Place[];
  bookings: Booking[];
  checklistItems: ChecklistItem[];
  today: string;
};

export type TodaySelection =
  | {
      status: "active";
      trip: Trip;
      day: TripDay;
      isExactDay: boolean;
      places: Place[];
      bookings: Booking[];
      checklistItems: ChecklistItem[];
    }
  | {
      status: "none";
    };

function byTripStartDate(left: Trip, right: Trip): number {
  return left.startDate.localeCompare(right.startDate);
}

function byDayDate(left: TripDay, right: TripDay): number {
  return left.date.localeCompare(right.date) || left.orderIndex - right.orderIndex;
}

function byOrderIndex<T extends { orderIndex: number }>(left: T, right: T): number {
  return left.orderIndex - right.orderIndex;
}

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function selectTodayTrip(input: TodaySelectionInput): TodaySelection {
  const activeTrip = [...input.trips]
    .sort(byTripStartDate)
    .find(
      (trip) => trip.startDate <= input.today && input.today <= trip.endDate
    );

  if (!activeTrip) {
    return { status: "none" };
  }

  const tripDays = input.days
    .filter((day) => day.tripId === activeTrip.id)
    .sort(byDayDate);
  const exactDay = tripDays.find((day) => day.date === input.today);
  const nearestFutureDay = tripDays.find((day) => day.date > input.today);
  const latestPastDay = [...tripDays]
    .reverse()
    .find((day) => day.date < input.today);
  const selectedDay = exactDay ?? nearestFutureDay ?? latestPastDay;

  if (!selectedDay) {
    return { status: "none" };
  }

  return {
    status: "active",
    trip: activeTrip,
    day: selectedDay,
    isExactDay: Boolean(exactDay),
    places: input.places
      .filter((place) => place.tripId === activeTrip.id && place.dayId === selectedDay.id)
      .sort(byOrderIndex),
    bookings: input.bookings.filter(
      (booking) => booking.tripId === activeTrip.id && booking.dayId === selectedDay.id
    ),
    checklistItems: input.checklistItems
      .filter((item) => item.tripId === activeTrip.id)
      .sort(byOrderIndex)
  };
}
