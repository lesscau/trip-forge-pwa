import Dexie, { type EntityTable } from "dexie";

export type Trip = {
  id: string;
  name: string;
  startsOn?: string;
  endsOn?: string;
  createdAt: string;
  updatedAt: string;
};

export type TripDay = {
  id: string;
  tripId: string;
  date: string;
  title: string;
};

export type Place = {
  id: string;
  tripId: string;
  name: string;
  chineseName?: string;
  address?: string;
  chineseAddress?: string;
  latitude?: number;
  longitude?: number;
};

export type Expense = {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency: string;
  spentOn: string;
};

export type Booking = {
  id: string;
  tripId: string;
  title: string;
  reference?: string;
  startsAt?: string;
};

export type TravelDocument = {
  id: string;
  tripId: string;
  title: string;
  documentType: string;
  notes?: string;
};

export type Note = {
  id: string;
  tripId: string;
  title: string;
  body: string;
};

export type ChecklistItem = {
  id: string;
  tripId: string;
  label: string;
  isDone: boolean;
};

export const db = new Dexie("tripforge") as Dexie & {
  trips: EntityTable<Trip, "id">;
  tripDays: EntityTable<TripDay, "id">;
  places: EntityTable<Place, "id">;
  expenses: EntityTable<Expense, "id">;
  bookings: EntityTable<Booking, "id">;
  travelDocuments: EntityTable<TravelDocument, "id">;
  notes: EntityTable<Note, "id">;
  checklistItems: EntityTable<ChecklistItem, "id">;
};

db.version(1).stores({
  trips: "id, name, startsOn, endsOn",
  tripDays: "id, tripId, date",
  places: "id, tripId, name",
  expenses: "id, tripId, spentOn",
  bookings: "id, tripId, startsAt",
  travelDocuments: "id, tripId, documentType",
  notes: "id, tripId, title",
  checklistItems: "id, tripId, isDone"
});
