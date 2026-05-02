import Dexie, { type EntityTable } from "dexie";

export type BookingType = "hotel" | "train" | "flight" | "attraction" | "other";
export type PlaceCategory =
  | "attraction"
  | "food"
  | "station"
  | "airport"
  | "hotel"
  | "shopping"
  | "walk"
  | "museum"
  | "park"
  | "other";
export type TravelDocumentType =
  | "passport"
  | "visa"
  | "insurance"
  | "ticket"
  | "booking"
  | "other";

export type Trip = {
  id: string;
  title: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TripDay = {
  id: string;
  tripId: string;
  date: string;
  city: string;
  summary?: string;
  orderIndex: number;
};

export type Place = {
  id: string;
  tripId: string;
  dayId?: string;
  city?: string;
  category?: PlaceCategory;
  name: string;
  nameZh?: string;
  address?: string;
  addressZh?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  orderIndex: number;
};

export type Expense = {
  id: string;
  tripId: string;
  dayId?: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  paidBy?: string;
  createdAt: string;
};

export type Booking = {
  id: string;
  tripId: string;
  dayId?: string;
  type: BookingType;
  title: string;
  confirmationCode?: string;
  startsAt?: string;
  endsAt?: string;
  address?: string;
  addressZh?: string;
  notes?: string;
};

export type TravelDocument = {
  id: string;
  tripId: string;
  title: string;
  type: TravelDocumentType;
  notes?: string;
  createdAt: string;
};

export type Note = {
  id: string;
  tripId: string;
  dayId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ChecklistItem = {
  id: string;
  tripId: string;
  title: string;
  completed: boolean;
  category?: string;
  orderIndex: number;
};

export type TripForgeDatabase = Dexie & {
  trips: EntityTable<Trip, "id">;
  tripDays: EntityTable<TripDay, "id">;
  places: EntityTable<Place, "id">;
  expenses: EntityTable<Expense, "id">;
  bookings: EntityTable<Booking, "id">;
  travelDocuments: EntityTable<TravelDocument, "id">;
  notes: EntityTable<Note, "id">;
  checklistItems: EntityTable<ChecklistItem, "id">;
};

export const db = new Dexie("tripforge") as TripForgeDatabase;

db.version(1).stores({
  trips: "id, title, destinationCountry, startDate, endDate, updatedAt",
  tripDays: "id, tripId, date, orderIndex, [tripId+orderIndex], [tripId+date]",
  places: "id, tripId, dayId, orderIndex, [tripId+orderIndex], [dayId+orderIndex]",
  expenses: "id, tripId, dayId, category, createdAt",
  bookings: "id, tripId, dayId, type, startsAt",
  travelDocuments: "id, tripId, type, createdAt",
  notes: "id, tripId, dayId, updatedAt",
  checklistItems: "id, tripId, category, completed, orderIndex, [tripId+orderIndex]"
});
