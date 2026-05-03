import type {
  Booking,
  BookingType,
  ChecklistItem,
  Expense,
  Place,
  PlaceCategory,
  Trip,
  TripDay,
  TravelDocument,
  TravelDocumentType
} from "../../db/database";
import type { DayWithPlaces } from "../../app/tripDetailData";

export type DayFormValues = {
  date: string;
  city: string;
  summary: string;
};

export type InsertDayFormValues = Omit<DayFormValues, "date">;

export type PlaceFormValues = {
  name: string;
  city: string;
  category: PlaceCategory;
  nameZh: string;
  address: string;
  addressZh: string;
  lat: string;
  lng: string;
  amapPlaceId: string;
  amapUrl: string;
  notes: string;
};

export type ChecklistFormValues = {
  title: string;
  category: string;
};

export type ExpenseFormValues = {
  title: string;
  amount: string;
  currency: string;
  category: string;
  paidBy: string;
  dayId: string;
};

export type BookingFormValues = {
  type: BookingType;
  title: string;
  confirmationCode: string;
  startsAt: string;
  endsAt: string;
  address: string;
  addressZh: string;
  notes: string;
};

export type DocumentFormValues = {
  type: TravelDocumentType;
  title: string;
  notes: string;
};

export type TripDetailViewData = {
  trip?: Trip;
  daysWithPlaces: DayWithPlaces[];
  places: Place[];
  expenses: Expense[];
  bookings: Booking[];
  documents: TravelDocument[];
  checklistItems: ChecklistItem[];
};

export type TripDetailLoadState = {
  isLoading: boolean;
  errorMessage?: string;
};

export type TripDetailSectionData = TripDetailViewData & TripDetailLoadState;

export const EMPTY_DAY_FORM: DayFormValues = {
  date: "",
  city: "",
  summary: ""
};

export const EMPTY_INSERT_DAY_FORM: InsertDayFormValues = {
  city: "",
  summary: ""
};

export const EMPTY_PLACE_FORM: PlaceFormValues = {
  name: "",
  city: "",
  category: "other",
  nameZh: "",
  address: "",
  addressZh: "",
  lat: "",
  lng: "",
  amapPlaceId: "",
  amapUrl: "",
  notes: ""
};

export const EMPTY_CHECKLIST_FORM: ChecklistFormValues = {
  title: "",
  category: ""
};

export const EMPTY_EXPENSE_FORM: ExpenseFormValues = {
  title: "",
  amount: "",
  currency: "CNY",
  category: "",
  paidBy: "",
  dayId: ""
};

export const EMPTY_BOOKING_FORM: BookingFormValues = {
  type: "hotel",
  title: "",
  confirmationCode: "",
  startsAt: "",
  endsAt: "",
  address: "",
  addressZh: "",
  notes: ""
};

export const EMPTY_DOCUMENT_FORM: DocumentFormValues = {
  type: "passport",
  title: "",
  notes: ""
};

export function getLastDayDate(days: TripDay[]): string | undefined {
  return [...days].sort((left, right) => right.orderIndex - left.orderIndex)[0]
    ?.date;
}
