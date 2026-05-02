import type {
  Booking,
  ChecklistItem,
  Place,
  PlaceCategory,
  Trip,
  TripDay
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
  category: PlaceCategory;
  nameZh: string;
  address: string;
  addressZh: string;
  notes: string;
};

export type ChecklistFormValues = {
  title: string;
  category: string;
};

export type TripDetailViewData = {
  trip?: Trip;
  daysWithPlaces: DayWithPlaces[];
  places: Place[];
  bookings: Booking[];
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
  category: "other",
  nameZh: "",
  address: "",
  addressZh: "",
  notes: ""
};

export const EMPTY_CHECKLIST_FORM: ChecklistFormValues = {
  title: "",
  category: ""
};

export function getLastDayDate(days: TripDay[]): string | undefined {
  return [...days].sort((left, right) => right.orderIndex - left.orderIndex)[0]
    ?.date;
}
